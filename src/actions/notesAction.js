import dispatcher from "../AppDispatcher";
import * as notesApi from "../api/notesApi";
import actionTypes from "./actionTypes";

export function saveNote(note) {
	return notesApi.saveNote(note).then((savedNote) => {
		dispatcher.dispatch({
			actionType: note.id ? actionTypes.UPDATE_NOTE : actionTypes.CREATE_NOTE,
			note: {
				title: savedNote.story.content.Title,
				id: savedNote.story.id,
				slug: savedNote.story.slug,
				content: savedNote.story.content.Content,
			},
		});
	});
}

export function loadNotes() {
	return notesApi.getNotes().then((notes) => {
		dispatcher.dispatch({
			actionType: actionTypes.LOAD_NOTES,
			notes: notes.stories.map((story) => ({
				title: story.content.Title,
				id: story.id,
				slug: story.slug,
				content: story.content.Content,
			})),
		});
	});
}

export function searchNotes(keyword) {
	return notesApi.searchAllNotes(keyword).then((notes) => {
		dispatcher.dispatch({
			actionType: actionTypes.SEARCH_NOTES,
			notes: notes.stories.map((story) => story.id),
		});
	});
}

export function deleteNote(id) {
	return notesApi.deleteNote(id).then(() => {
		dispatcher.dispatch({
			actionType: actionTypes.DELETE_NOTE,
			id: id,
		});
	});
}
