export class App {

    configureRouter(config, router) {
        config.title = 'Zordia Battle';
        config.map([
            { route: ['', 'create-character'], name: 'Create character', moduleId: 'pages/createCharacter/create-character', nav: true, title: 'Create character' },
            { route: 'combat', name: 'combat', moduleId: 'pages/combat/combat', nav: true, title: 'Github Users' }
            // { route: 'child-router', name: 'child-router', moduleId: 'child-router', nav: true, title: 'Child Router' }
        ]);

        this.router = router;
    }
}
