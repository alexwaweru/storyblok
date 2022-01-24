import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const NotesList = (props) => {
	return (
		<table className="table">
			<thead>
				<tr>
					<th>Title</th>
					<th>Content</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{props.notes.map((note) => {
					return (
						<tr key={note.id}>
							<td>
								<Link to={"/note/" + note.slug}>{note.title}</Link>
							</td>
							<td>{note.content}</td>
							<td>
								<button className="btn btn-outline-danger" onClick={() => props.onDelete(note.id)}>
									Delete
								</button>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

NotesList.propTypes = {
	notes: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
			content: PropTypes.string.isRequired,
		})
	).isRequired,
};

export default NotesList;
