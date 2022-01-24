import { EventEmitter } from "events";
import Dispatcher from "../AppDispatcher";
import actionTypes from "../actions/actionTypes";

const CHANGE_EVENT = "change";
let _notes = [];

class NotesStore extends EventEmitter {
	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	}

	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	getNotes() {
		return _notes;
	}

	getNoteBySlug(slug) {
		return _notes.find((note) => {
			return note.slug === slug;
		});
	}
}

const store = new NotesStore();
Dispatcher.register((action) => {
	switch (action.actionType) {
		case actionTypes.CREATE_NOTE:
			_notes.push(action.note);
			store.emitChange();
			break;

		case actionTypes.LOAD_NOTES:
			_notes = action.notes;
			store.emitChange();
			break;

		case actionTypes.SEARCH_NOTES:
			_notes = _notes.filter((note) => action.notes.includes(note.id));
			store.emitChange();
			break;

		case actionTypes.UPDATE_NOTE:
			_notes = _notes.map((note) => (note.id === action.note.id ? action.note : note));
			store.emitChange();
			break;

		case actionTypes.DELETE_NOTE:
			_notes = _notes.filter((note) => note.id !== action.id);
			store.emitChange();
			break;

		default:
		// nothing
	}
});

export default store;
