var express = require("express");
var cors = require("cors");

var server = express();

server.use(express.json()); // parse application/json
server.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// allow cors
server.use(cors());

const StoryblokClient = require("storyblok-js-client");

/**
 * This returns story with content but does not support search
 * Suitable for initial fetch of all stories i.e. setting the flux store
 */
let StoryblokReader = new StoryblokClient({
	accessToken: "LzBMLtu6r17GUKgOBl7Xgwtt",
	cache: {
		type: "memory",
	},
});

/**
 * This returns story without content but supports search
 * Suitable for consequent fetches of stories & writes-> use id to filter in the flux store
 */
let StoryblokWriter = new StoryblokClient({
	oauthToken: "hxrdEvwHZ0c24LnxIlu2SQtt-107285-1ewaPu8hujx_dyi7VEK9",
});

/**
 * get one note/story (with full text search)
 * e.g. GET http://127.0.0.1/note/69689
 */
server.get("/note/:id", function (req, res) {
	console.log(req.params);
	StoryblokWriter.get(`spaces/143887/stories/${req.params.id}`, {})
		.then((response) => {
			// eslint-disable-next-line no-console
			console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			// eslint-disable-next-line no-console
			console.log(error);
			res.send(error);
		});
});

/**
 * delete a note/story (with full text search)
 * e.g. DELETE http://127.0.0.1/note/69689
 */
server.delete("/note/:id", function (req, res) {
	StoryblokWriter.delete(`spaces/143887/stories/${req.params.id}`, {})
		.then((response) => {
			// eslint-disable-next-line no-console
			console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			// eslint-disable-next-line no-console
			console.log(error);
			res.send(error);
		});
});

/**
 * get all notes/stories
 * e.g. GET http://127.0.0.1/notes
 */
server.get("/notes/", function (req, res) {
	StoryblokReader.flushCache();
	StoryblokReader.get("cdn/stories/", {})
		.then((response) => {
			// eslint-disable-next-line no-console
			console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			// eslint-disable-next-line no-console
			console.log(error);
			res.send(error);
		});
});

/**
 * search all notes/stories with full text search
 * e.g. GET http://127.0.0.1/search?q=new-note
 */
server.get("/search/", function (req, res) {
	StoryblokWriter.get("spaces/143887/stories/", {
		text_search: req.query.q,
	})
		.then((response) => {
			// eslint-disable-next-line no-console
			console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			// eslint-disable-next-line no-console
			console.log(error);
			res.send(error);
		});
});

/**
 * create a new note (story)
 * e.g. POST http://127.0.0.1/note
 */
server.post("/note/", function (req, res) {
	console.log(req.body);
	const error = validateNote(req.body);
	if (error) {
		res.status(400).send(error);
	} else {
		req.body.slug = createSlug(req.body.title); // Generate a slug for new notes.
		StoryblokWriter.post("spaces/143887/stories/", {
			story: {
				name: req.body.title,
				slug: req.body.slug,
				content: {
					component: "page",
					Title: req.body.title,
					Content: req.body.content,
				},
			},
			publish: 1,
		})
			.then((response) => {
				// eslint-disable-next-line no-console
				console.log(response.data);
				res.send(response.data);
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.log(error);
				res.send(error);
			});
	}
});

/**
 * update a note (story)
 * e.g. PUT http://127.0.0.1/note
 */
server.put("/note/:id", function (req, res) {
	const error = validateNote(req.body);
	if (error) {
		res.status(400).send(error);
	} else {
		req.body.slug = createSlug(req.body.title); // Generate a slug for new notes (in case title changed)
		StoryblokWriter.put(`spaces/143887/stories/${req.params.id}`, {
			story: {
				name: req.body.title,
				slug: req.body.slug,
				id: req.params.id,
				content: {
					component: "page",
					Title: req.body.title,
					Content: req.body.content,
				},
			},
			publish: 1,
		})
			.then((response) => {
				// eslint-disable-next-line no-console
				console.log(response.data);
				res.send(response.data);
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.log(error);
				res.send(error);
			});
	}
});

// start server & listen at port 3001
server.listen(3001, function () {
	// eslint-disable-next-line no-console
	console.log("Serverlistening on port 3001!");
});

// validate the note data
function validateNote(note) {
	if (!note.title) return "Title is required.";
	if (!note.content) return "Content is required.";
	return "";
}

// returns a URL friendly slug
function createSlug(value) {
	return value
		.replace(/[^a-z0-9_]+/gi, "-")
		.replace(/^-|-$/g, "")
		.toLowerCase();
}
