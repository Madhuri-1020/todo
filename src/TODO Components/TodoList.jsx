import { useState } from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

const style = {
    borderRadius: '5px',
}

const Addbutton = {
    borderRadius: '5px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    padding: '3px 10px'
}

const DeleteButton = {
    color: 'white',
    backgroundColor: 'red',
    borderRadius: '5px',
    border: 'none',
}

const EditButton = {
    color: 'white',
    backgroundColor: 'blue',
    borderRadius: '5px',
    border: 'none',
}

const SerchButton={
    backgroundColor:'black',
    color:'white',
    borderRadius:'5px'
}

const TodoList = () => {
    const [item, setItem] = useState('');
    const [addItem, setAddItem] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [searchItem, setSearchItem] = useState('');

    const onHandleChangeItem = (e) => {
        setItem(e.target.value);
    }

    const onSearchChange = (e) => {
        setSearchItem(e.target.value);
    }
    
    const ClickToAdd = () => {
        if (item.trim() !== '') {
            if (editItem !== null) {
                const updateItem = [...addItem];
                updateItem[editItem] = item;
                setAddItem(updateItem);
                setEditItem(null);
            } else {
                setAddItem([...addItem, item]);
            }

            setItem('');
        }
    }

    const ClickToDelete = (index) => {
        const updateItem = [...addItem];
        updateItem.splice(index, 1);
        setAddItem(updateItem)
    }

    const ClickToEdit = (index) => {
        setItem(addItem[index]);
        setEditItem(index);
    }
    const ClickToSerch = () => {
        alert(addItem.includes(searchItem)?'Item Found':'Item Not Found')
        setSearchItem('')
    }

    return (
        <div className="d-flex flex-column align-items-center mt-5">
            <h1>TODO List</h1>
            <div className=" mt-2">
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
                <ul className="mt-3 ps-0">
                    <h4><u>All Tasks</u></h4>
                    {addItem.map((inputItem, index) => {
                        return (
                            <li key={index} className=" mt-2 list-group-item d-flex justify-content-between align-items-center">
                                <span>
                                    <input type="checkbox" className="me-1" />
                                    {inputItem}
                                </span>
                                <span>
                                    <button className="me-1"
                                        style={EditButton}
                                        onClick={() => ClickToEdit(index)}>
                                        <EditIcon />
                                    </button>
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