import React, { Component } from 'react';
import axios from 'axios';
import { Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from 'reactstrap';

class App extends Component {
  state = {
    books: [],
    newBookData: {
      title: '',
      rating: ''
    },
    editBookData: {
      id: '',
      title: '',
      rating: ''
    },
    newBookModal: false,
    editBookModal: false
  }
  componentWillMount() {
    this._refreshBooks();
  }
  toggleNewBookModal() {
    this.setState({
      newBookModal: ! this.state.newBookModal
    });
  }
  toggleEditBookModal() {
    this.setState({
      editBookModal: ! this.state.editBookModal
    });
  }
  addBook() {
    axios.post('http://localhost:3000/books', this.state.newBookData).then((response) => {
      let { books } = this.state;

      books.push(response.data);

      this.setState({ books, newBookModal: false, newBookData: {
        title: '',
        rating: ''
      }});
    });
  }
  updateBook() {
    let { title, rating } = this.state.editBookData;

    axios.put('http://localhost:3000/books/' + this.state.editBookData.id, {
      title, rating
    }).then((response) => {
      this._refreshBooks();

      this.setState({
        editBookModal: false, editBookData: { id: '', title: '', rating: '' }
      })
    });
  }
  editBook(id, title, rating) {
    this.setState({
      editBookData: { id, title, rating }, editBookModal: !this.state.editBookModal
    });
  }
  deleteBook(id) {
    axios.delete('http://localhost:3000/books/' + id).then((response) => {
      this._refreshBooks();
    });
  }
  _refreshBooks() {
    axios.get('http://localhost:3000/books').then((response) => {
      this.setState({
        books: response.data
      })
    });
  }
  render() {
    let books = this.state.books.map((book) => {
      return (
        <tr key={book.id}>
          <td>{book.id}</td>
          <td>{book.title}</td>
          <td>{book.rating}</td>
          <td>
            <Button color="success" size="sm" className="mr-2" onClick={this.editBook.bind(this, book.id, book.title, book.rating)}>Edytuj</Button>
            <Button color="danger" size="sm" onClick={this.deleteBook.bind(this, book.id)}>Usuń</Button>
          </td>
        </tr>
      )
    });
    return (
      <div className="App container">
        <h1>Książki</h1>

        <Button className="my-3" color="primary" onClick={this.toggleNewBookModal.bind(this)}>Dodaj książkę</Button>

        <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)}>
          <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Dodawanie nowej książki</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="title">Tytuł</Label>
                <Input id="title" value={this.state.newBookData.title} onChange={(e) => {
                  let { newBookData } = this.state;

                  newBookData.title = e.target.value;

                  this.setState({ newBookData });
                }} />
              </FormGroup>
              <FormGroup>
                <Label for="rating">Ocena</Label>
                <Input id="rating" value={this.state.newBookData.rating} onChange={(e) => {
                  let { newBookData } = this.state;

                  newBookData.rating = e.target.value;

                  this.setState({ newBookData });
                }} />
              </FormGroup>

            </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addBook.bind(this)}>Dodaj książkę</Button>{' '}
            <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>Anuluj</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.editBookModal} toggle={this.toggleEditBookModal.bind(this)}>
          <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edycja książki</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="title">Tytuł</Label>
                <Input id="title" value={this.state.editBookData.title} onChange={(e) => {
                  let { editBookData } = this.state;

                  editBookData.title = e.target.value;

                  this.setState({ editBookData });
                }} />
              </FormGroup>
              <FormGroup>
                <Label for="rating">Ocena</Label>
                <Input id="rating" value={this.state.editBookData.rating} onChange={(e) => {
                  let { editBookData } = this.state;

                  editBookData.rating = e.target.value;

                  this.setState({ editBookData });
                }} />
              </FormGroup>

            </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateBook.bind(this)}>Zaakceptuj</Button>{' '}
            <Button color="secondary" onClick={this.toggleEditBookModal.bind(this)}>Anuluj</Button>
          </ModalFooter>
        </Modal>


        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Tytuł</th>
              <th>Ocena</th>
              <th>Akcje</th>
            </tr>
          </thead>

          <tbody>
            {books}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
