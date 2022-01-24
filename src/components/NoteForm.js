import React from "react";
import TextInput from "./common/TextInput";
import PropTypes from "prop-types";

function NoteForm(props) {
	return (
		<form onSubmit={props.onSubmit}>
			<TextInput
				id="title"
				name="title"
				label="Title"
				onChange={props.onChange}
				value={props.note.title}
				error={props.errors.title}
			/>

			<TextInput
				id="content"
				name="content"
				label="content"
				onChange={props.onChange}
				value={props.note.content}
				error={props.errors.title}
			/>

			<input type="submit" value="Save" className="btn btn-primary" />
		</form>
	);
}

NoteForm.propTypes = {
	note: PropTypes.object.isRequired,
	errors: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default NoteForm;
