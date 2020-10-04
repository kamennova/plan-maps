import app from './app';
import types from './src/types';

// tslint:disable-next-line:no-shadowed-variable
app().then(({app, container}) => {
    const port = container.get<number>(types.HttpPort);
    app.listen(port);
    // tslint:disable-next-line:no-console
    console.log(`server is started on port ${port}`);
});
