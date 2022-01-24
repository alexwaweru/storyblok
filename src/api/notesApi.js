import { handleResponse, handleError } from "./apiUtils";
const baseUrl = "http://localhost:3001";

export function getNote(noteId) {
	return fetch(`${baseUrl}/note/${noteId}`).then(handleResponse).catch(handleError);
}

export function deleteNote(noteId) {
	return fetch(`${baseUrl}/note/${noteId}`, { method: "DELETE" }).then(handleResponse).catch(handleError);
}

export function getNotes() {
	return fetch(`${baseUrl}/notes/`).then(handleResponse).catch(handleError);
}

export function searchAllNotes(keyword) {
	return fetch(`${baseUrl}/search?q=${keyword}`).then(handleResponse).catch(handleError);
}

export function saveNote(note) {
	return fetch(`${baseUrl}/note/${note.id ? note.id : ""}`, {
		method: note.id ? "PUT" : "POST", // POST for create, PUT to update when id already exists.
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			...note,
		}),
	})
		.then(handleResponse)
		.catch(handleError);
}
