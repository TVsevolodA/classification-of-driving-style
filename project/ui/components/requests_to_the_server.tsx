export default async function requestsToTheServer (
    url: string,
    method: string,
    data: string = null,
    header = {},
) {
    let serverResponse = {
        data: null,
        ok: null,
        statusCode: null,
        error: null,
    };
    try {
        const response: Response = await fetch(
            url,
            {
                method: method,
                body: data,
                credentials: 'include',
                headers: header,
            });
        serverResponse.ok = response.ok;
        serverResponse.statusCode = response.status;
        const result = await response.json();
        serverResponse.data = result;
    } catch (error) {
        serverResponse.error = error;
    }
    return serverResponse;
}