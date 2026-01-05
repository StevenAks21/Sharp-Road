export async function handleLogin({
    username,
    password,
    serverURL
}) {
    const response = await fetch(`${serverURL}/auth`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const json = await response.json();

    if (!response.ok) {
        throw new Error(json.message || "Login failed");
    }

    localStorage.setItem("token", json.token);

    return json;
}