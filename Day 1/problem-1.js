function getUserProfile(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(`fetching user profile with user id ${userId}`);
        }, 50);
    });
}

function getRecentOrders() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(["Order 1", "Order 2", "Order 3"]);
        }, 150);
    });
}

function getNotifications() {
    return new Promise((resolve, reject) => {
        const outcome = Math.random();

        if (outcome < 0.33) {
            setTimeout(() => {
                resolve(["Notification A", "Notification B"]);
            }, 100);
        }
        else if (outcome < 0.66) {
            setTimeout(() => {
                resolve(["Notification C", "Notification D"]);
            }, 2000);
        }
        else {
            setTimeout(() => {
                reject(new Error("Failed to fetch notifications"));
            }, 500);
        }
    });
}

async function getUserDashboard(userId) {
    console.time("Dashboard Load Time");

    const userProfilePromise = getUserProfile(userId);
    const recentOrdersPromise = getRecentOrders();

    const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
            resolve("Timed out fetching notifications");
        }, 300);
    });

    let notificationsPromise = Promise.race([
        getNotifications().catch(err => "Error fetching notifications"), timeoutPromise
    ]);

    const results = await Promise.allSettled([
        userProfilePromise,
        recentOrdersPromise,
        notificationsPromise
    ]);

    console.timeEnd("Dashboard Load Time");
    console.log("FINAL DASHBOARD DATA: ", results);

}

getUserDashboard(10);