const username = document.querySelector("#username");
const password = document.querySelector("#password");
const sendBtn = document.querySelector("#send");

sendBtn.addEventListener("click", async () => {
	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			username: username.textContent,
			password: password.textContent,
		}),
	};
	const postReq = await fetch("/api/signUp", options);
	const response = await postReq.json();
	console.log(response);
});
