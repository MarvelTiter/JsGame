export async function httpGet(url: string) {
    const response = await fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json"
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer" // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    const contentLength = Number(response.headers.get("Content-Length")!)
    let receivedLength = 0
    let reader = response.body!.getReader()
    let chunks = []
    while (true) {
        const { done, value } = await reader.read()
        if (done) {
            break
        }
        chunks.push(value)
        receivedLength += value?.length || 0
    }
    let chunksAll = new Uint8Array(receivedLength)
    let position = 0
    for (let chunk of chunks) {
        if (chunk === undefined) continue
        chunksAll.set(chunk, position)
        position += chunk.length
    }
    let result = new TextDecoder("utf-8").decode(chunksAll)
    let commits = JSON.parse(result)
    return commits
}
