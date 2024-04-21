import { useState, useEffect } from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { auth } from '../Firebase/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, addDoc, updateDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig';

// Styling add input field  in todo
const style = {
    borderRadius: '5px',
}
// styling add button in todo
const Addbutton = {
    borderRadius: '5px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    padding: '3px 10px'
}
// styling delete button in todo
const DeleteButton = {
    color: 'white',
    backgroundColor: 'red',
    borderRadius: '5px',
    border: 'none',
}
// styling edit button in todo
const EditButton = {
    color: 'white',
    backgroundColor: 'blue',
    borderRadius: '5px',
    border: 'none',
}
// styling search button in todo
const SerchButton = {
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '5px'
}
// styling google login button in todo
const LoginButton = {
    borderRadius: '5px',
    backgroundColor: 'rgb(226,167,111)',
    color: 'white',
    border: 'none'
}

const TodoList = () => {
    // useState for item, addItem, editItem, serachItem
    const [item, setItem] = useState('');
    const [addItem, setAddItem] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [searchItem, setSearchItem] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {

            if (user) {

                const fetchData = async () => {
                    const querySnapshot = await getDocs(collection(db, 'todoLists'));
                    const todos = [];
                    querySnapshot.forEach((doc) => {
                        todos.push({ ...doc.data(), id: doc.id });
                    });
                    setAddItem(todos);
                };
                fetchData();
            } else {
                console.log("Not logged in");
            }
        });

        return () => unsubscribe();
    }, []);

    // google login functionality
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            alert("login successfull")
        } catch (error) {
            console.error('Google login error:', error);
        }
    };


    const onHandleChangeItem = (e) => {
        setItem(e.target.value);
    }

    const onSearchChange = (e) => {
        setSearchItem(e.target.value);
    }

    // functionality to add task to todo
    const ClickToAdd = async () => {
        if (item.trim() !== '' && auth.currentUser) {
            try {
                if (editItem !== null) {

                    const todoRef = doc(db, 'todoLists', addItem[editItem].id);
                    await updateDoc(todoRef, {
                        text: item,
                    });
                    setAddItem(prevItems => {
                        const updatedItems = [...prevItems];
                        updatedItems[editItem].text = item;
                        return updatedItems;
                    });
                    setEditItem(null);
                } else {

                    const docRef = await addDoc(collection(db, 'todoLists'), {
                        text: item,
                        userId: auth.currentUser.uid,
                    });
                    setAddItem([...addItem, { text: item, userId: auth.currentUser.uid, id: docRef.id }]);
                }
                setItem('');
            } catch (error) {
                console.error("Error adding/updating document: ", error);
            }
        } else {
            console.error("User not authenticated");
            alert('Please login to add/edit todo');
        }
    };



    // functionality to delete a task from todo
    const ClickToDelete = async (index) => {
        try {
            const todoRef = doc(db, 'todoLists', addItem[index].id);

            if (!auth.currentUser) {
                alert('Please login to delete todo');
                return;
            }
            if (auth.currentUser.uid === addItem[index].userId) {
                await deleteDoc(todoRef);
                alert('Todo deleted successfully');


                const updatedItems = addItem.filter((item, idx) => idx !== index);
                setAddItem(updatedItems);
            } else {
                alert('You do not have permission to delete this todo');
            }
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert('Failed to delete todo');
        }
    };


    // functionality to edit a task from todo
    const ClickToEdit = (index) => {
        if (!auth.currentUser) {
            alert('Please login to edit todo');
            return;
        }
        if (auth.currentUser.uid === addItem[index].userId) {
            setItem(addItem[index].text);
            setEditItem(index);
        } else {
            console.error("User does not have permission to edit this todo");
            alert('You do not have permission to edit this todo');
        }
    };

    // functionality to serach a task in todo
    const ClickToSerch = () => {
        alert(addItem.some(item => item.text === searchItem) ? 'Item Found' : 'Item Not Found')
        setSearchItem('')
    }

    return (
        <div className="d-flex flex-column align-items-center mt-5">
            <h1>TODO List</h1>
            <div className=" mt-2">
                {/* input field, and add button to add a task in todo  */}
                <input style={style}
                    type="text"
                    name="addInput"
                    id="add"
                    placeholder="Enter todo item"
                    value={item}
                    onChange={onHandleChangeItem} />
                <button style={Addbutton}
                    className=" ms-2"
                    onClick={ClickToAdd}>
                    {editItem !== null ? 'Update' : 'Add'}
                </button>
                <div className="mt-3">
                    {/* input field and serch button to search a task in todo */}
                    <input style={style}
                        type="text"
                        placeholder="Search Item"
                        value={searchItem}
                        onChange={onSearchChange}
                    />
                    <button style={SerchButton}
                        className="ms-2"
                        onClick={ClickToSerch}>
                        <SearchIcon />
                    </button>
                </div>
                {/* button to login into google account */}
                <button className="mt-2 p-2"
                    style={LoginButton}
                    onClick={handleGoogleLogin}>
                    Login with Google
                </button>
                <ul className="mt-3 ps-0">
                    {/* ul list to add tasks to todo */}
                    <h4><u>All Tasks</u></h4>
                    {addItem.map((inputItem, index) => {
                        return (
                            <li key={index} className=" mt-2 list-group-item d-flex justify-content-between align-items-center">
                                <span>
                                    {/* check box and task element */}
                                    <input type="checkbox" className="me-1" />
                                    {inputItem.text}
                                </span>
                                <span>
                                    {/* button to edit a task in todo */}
                                    <button className="me-1"
                                        style={EditButton}
                                        onClick={() => ClickToEdit(index)}>
                                        <EditIcon />
                                    </button>
                                    {/* button to delete a task from todo */}
                                    <button style={DeleteButton}
                                        onClick={() => ClickToDelete(index)}>
                                        <DeleteForeverIcon />
                                    </button>
                                </span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}
export default TodoList;