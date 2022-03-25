import * as functions from 'firebase-functions';

interface IResponse {
    message: string;
}
// type IResponse = string;
export const helloWorld: functions.HttpsFunction = functions.https.onRequest(
    (request: functions.https.Request, response: functions.Response<IResponse>) => {
        functions.logger.info('Hello logs!', { structuredData: true });
        response.send({ message: 'str' });
    }
);
