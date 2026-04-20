const menuRoute = {
    routes: [
        {
            path: '/accountManagement',
            name: 'accountManagement',
            routes: [
                {
                    path: '/accountManagement/accountList',
                    name: 'accountList',
                },
            ],
        },
    ],
};

export default menuRoute;
