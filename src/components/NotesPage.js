import React, { useState, useEffect } from "react";
import notesStore from "../stores/notesStore";
import NotesList from "./NotesList";
import { Link } from "react-router-dom";
import { loadNotes, deleteNote, saveNote, searchNotes } from "../actions/notesAction";
import { toast } from "react-toastify";

const NotesPage = () => {
	const [notes, setNotes] = useState(notesStore.getNotes());
	const [find, setFind] = useState("");
	const [replace, setReplace] = useState("");
	const [findToggle, setFindToggle] = useState(true);

	useEffect(() => {
		notesStore.addChangeListener(onChange);
		if (notesStore.getNotes().length === 0) loadNotes();
		return () => notesStore.removeChangeListener(onChange);
	}, []);

	useEffect(() => {
		if (find === "") {
			//loadNotes();
			setFindToggle(true);
		}
	}, [find]);

	function onChange() {
		setNotes(notesStore.getNotes());
	}

	function findNotes() {
		searchNotes(find);
		setFindToggle(!findToggle);
	}

	function replaceNotes() {
		let _notes = notes.map((note) => ({
			id: note.id,
			slug: note.slug.replaceAll(find, replace),
			content: note.content.replaceAll(find, replace),
			title: note.title.replaceAll(find, replace),
		}));
		loadNotes();
		_notes.forEach((note) =>
			saveNote(note).then(() => {
				toast.success(`${note.slug} updated!`);
			})
		);
		setFind("");
		setReplace("");
	}

	const handleDelete = (id) => {
		deleteNote(id).then(() => {
			toast.success("Course deleted!");
		});
	};

	return (
		<>
			<h2>Notes</h2>

			<div className="d-flex justify-content-between row">
				<div className="col-lg-4">
					<Link className="btn btn-primary" to="/note">
						Add Note
					</Link>
				</div>
				<div className="col-lg-4">
					<div className="row">
						<div className="col">
							<input
								type="text"
								className="form-control"
								placeholder="Find"
								aria-label="find"
								value={find}
								onChange={(e) => setFind(e.target.value)}
							/>
						</div>
						<div className="col">
							<input
								type="text"
								className="form-control"
								placeholder="Replace"
								aria-label="Replace"
								value={replace}
								onChange={(e) => setReplace(e.target.value)}
							/>
						</div>
						<div className="col d-grid gap-2">
							{findToggle ? (
								<button
									type="button"
									className={`btn btn-primary ${find ? "" : "disabled"}`}
									onClick={(e) => {
										findNotes();
									}}
								>
									Find
								</button>
							) : (
								<button
									type="button"
									className={`btn btn-primary ${replace ? "" : "disabled"}`}
									onClick={(e) => {
										replaceNotes();
									}}
								>
									Replace
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			<NotesList notes={notes} onDelete={handleDelete} />
		</>
	);
};

export default NotesPage;
