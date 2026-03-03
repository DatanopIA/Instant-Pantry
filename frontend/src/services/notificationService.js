import { LocalNotifications } from '@capacitor/local-notifications';

export const notificationService = {
    async requestPermissions() {
        // En navegadores web, Capacitor intentará manejar esto si está soportado, o simplemente devolverá granted
        const { display } = await LocalNotifications.requestPermissions();
        return display === 'granted';
    },

    async checkPermissions() {
        const { display } = await LocalNotifications.checkPermissions();
        return display === 'granted';
    },

    async scheduleExpirationNotifications(items, daysBefore = 3) {
        // Obtenemos los días antes según la configuración string ('1 día antes', '3 días antes'...)
        let daysToSubtract = 3;
        if (typeof daysBefore === 'string') {
            const match = daysBefore.match(/\d+/);
            if (match) {
                daysToSubtract = parseInt(match[0], 10);
            }
        } else if (typeof daysBefore === 'number') {
            daysToSubtract = daysBefore;
        }

        // Cancelamos notificaciones anteriores para no duplicar
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
            await LocalNotifications.cancel(pending);
        }

        const hasPermission = await this.checkPermissions();
        if (!hasPermission) {
            const result = await this.requestPermissions();
            if (!result) return;
        }

        const notifications = [];
        let idCounter = new Date().getTime() % 10000; // random offset id

        for (const item of items) {
            if (item.status === 'active' && item.expires_at) {
                const expiryDate = new Date(item.expires_at);
                // Asegurar que la fecha sea válida
                if (isNaN(expiryDate.getTime())) continue;

                // Calcular la fecha de notificación restando los días de aviso
                const notificationDate = new Date(expiryDate);
                notificationDate.setDate(notificationDate.getDate() - daysToSubtract);
                // Establecer una hora de aviso razonable, ej: 10:00 AM
                notificationDate.setHours(10, 0, 0, 0);

                // Solo programar si la fecha de notificación es en el futuro
                if (notificationDate.getTime() > Date.now()) {
                    idCounter++;
                    notifications.push({
                        title: '⚠️ Producto a punto de caducar',
                        body: `Tu ${item.products_master?.name} caduca en ${daysToSubtract} día(s). ¡Aprovéchalo a tiempo!`,
                        id: idCounter,
                        schedule: { at: notificationDate },
                        sound: null,
                        attachments: null,
                        actionTypeId: '',
                        extra: null
                    });
                } else if (expiryDate.getTime() > Date.now()) {
                    // Si ya pasó el momento del "aviso por antelación", pero aún no ha caducado, 
                    // mandamos una alerta inmediata (quizá mañana). Programaremos para en 1 hora o al instante.
                    idCounter++;
                    const soon = new Date(Date.now() + 1000 * 60 * 60); // 1 hora después
                    notifications.push({
                        title: '⚠️ Producto caducando',
                        body: `¡Atención! Tu ${item.products_master?.name} caduca muy pronto (${expiryDate.toLocaleDateString()}).`,
                        id: idCounter,
                        schedule: { at: soon },
                        sound: null,
                        attachments: null,
                        actionTypeId: '',
                        extra: null
                    });
                }
            }
        }

        if (notifications.length > 0) {
            try {
                await LocalNotifications.schedule({ notifications });
                console.log('Notificaciones programadas exitosamente:', notifications.length);
            } catch (error) {
                console.error('Error programando notificaciones:', error);
            }
        }
    }
};
