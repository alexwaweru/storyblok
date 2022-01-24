import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./common/Header";
import NotesPage from "./NotesPage";
import NotFoundPage from "./NotFoundPage";
import ManageNotesPage from "./ManageNotesPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
	return (
		<div className="container-fluid p-5">
			<ToastContainer autoClose={3000} hideProgressBar />
			<Header />
			<Switch>
				<Route path="/" exact component={NotesPage}></Route>
				<Route path="/note/:slug" component={ManageNotesPage}></Route>
				<Route path="/note" component={ManageNotesPage}></Route>
				<Route component={NotFoundPage}></Route>
			</Switch>
		</div>
	);
};

export default App;
