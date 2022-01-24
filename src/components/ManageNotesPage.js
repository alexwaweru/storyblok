import React, { useState, useEffect } from "react";
import NoteForm from "./NoteForm";
import { toast } from "react-toastify";
import notesStore from "../stores/notesStore";
import * as notesActions from "../actions/notesAction";

const ManageNotesPage = (props) => {
	const [errors, setErrors] = useState({});
	const [notes, setNotes] = useState(notesStore.getNotes());
	const [note, setNote] = useState({
		id: "",
		slug: "",
		title: "",
		content: "",
	});

	// Handle notes and note changes
	useEffect(() => {
		notesStore.addChangeListener(onChange);
		const slug = props.match.params.slug; // get slug from the path `/note/:slug`
		if (notes.length === 0) {
			notesActions.loadNotes();
		} else if (slug) {
			setNote(notesStore.getNoteBySlug(slug));
		}
		return () => notesStore.removeChangeListener(onChange);
	}, [notes.length, props.match.params.slug]);

	const onChange = () => {
		setNotes(notesStore.getNotes());
	};

	const handleChange = ({ target }) => {
		setNote({
			...note,
			[target.name]: target.value,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!formIsValid()) return;
		notesActions.saveNote(note).then(() => {
			props.history.push("/");
			toast.success("Note saved!");
		});
	};

	const formIsValid = () => {
		const _errors = {};
		if (!note.title) _errors.title = "Title is required";
		if (!note.content) _errors.content = "Content is required";
		setErrors(_errors);
		// form is valid if object _errors has no properties/keys
		return Object.keys(_errors).length === 0;
	};

	return (
		<>
			<h2>Manage Note</h2>
			<NoteForm errors={errors} note={note} onChange={handleChange} onSubmit={handleSubmit} />
		</>
	);
};

export default ManageNotesPage;
