import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form, Col, Row, ListGroup } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function CookBookTable({ onViewRecipe, onDeleteRecipe }) {

    const {user} = useContext(UserContext);

    //recipes
    const [recipeName, setRecipeName] = useState('');
    const [recipes, setRecipes] = useState([]);
  
    //ingredients
    const [ingredientName, setIngredientName] = useState('');
    const [ingredients, setIngredients] = useState([]);

    //recipe ingredients
    const [recipeIngredients, setRecipeIngredients] = useState([]);


    const handleSaveRecipe = async(e) => {
        e.preventDefault();
        try {
            
            if(!recipeName){
                toast.error('You did not input a recipe!')
            }
            else if(recipeIngredients.length === 0){
                toast.error('You did not input a ingredient!')
            } else{
                //save the recipe
                const result = await axios.post('/recipe/add-recipe', {
                    recipeName,
                    ingredients: recipeIngredients.map((ingredient) => ingredient._id),
                });
                
                if(result.data.error){
                    toast.error(result.data.error)
                } else{
                    toast.success(result.data.message);

                    const updatedResult = await axios.get('/recipe/get-recipe');
                    setRecipes(updatedResult.data);
                }
            }
        } catch (error) {
            console.log(error)
        } finally{
            closeModalRecipe()
        }
    }

    //display recipes
    useEffect(() => {
        const fetchRecipes = async() => {
            try {
                const result = await axios.get('/recipe/get-recipe');
                if(result.data.length > 0){
                    setRecipes(result.data);
                } else{
                    console.log('No recipes found.')
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchRecipes();
    }, [])
  

    //delete recipe
    const handleDeleteRecipe = async(recipeId, userId) => {
        try {
            const response = await axios.delete(`/recipe/delete-recipe/${userId}/${recipeId}`);

            if(response.data.error){
                toast.error(response.data.error)
            } else{
                setRecipes((prevRecipes) => prevRecipes
                .filter((recipe) => recipe._id !== recipeId));

                setRecipeIngredients((prevRecipeIngredients) =>
                prevRecipeIngredients.filter((ingredient) =>
                    !response.data.recipe?.ingredients.includes(ingredient._id)
                ));

                //to delete the cooking table
                onDeleteRecipe();
                toast.success(response.data.message)
            }
        } catch (error) {
            console.log(error)
        } finally{
            closeModalDelete();
        }
    }

    //save ingredient
    const handleSaveIngredient = async(e) => {
        e.preventDefault();

        try {
            if(!ingredientName){
                toast.error('You did not input a ingredient')
            } else{
                const result = await axios.post('/ingredient/add-ingredient', {
                    ingredientName
                });
        
                if(result.data.error){
                    toast.error(result.data.error)
                } else{
                    toast.success(result.data.message);
          
                    const updatedResult = await axios.get('/ingredient/get-ingredient');
                    setIngredients(updatedResult.data);
                }
            }
        } catch (error) {
            console.log(error)
        } finally{
            closeModalIngredient();
        }
    }
  
    //display ingredients
    useEffect(() => {
        const fetchIngredients = async() => {
            try {
                const result = await axios.get('/ingredient/get-ingredient');
                setIngredients(result.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchIngredients();
    }, [])


    //For modals area

    //MODALS
    const [showModalRecipe, setShowModalRecipe] = useState(false);
    const [showModalIngredient, setShowModalIngredient] = useState(false);

    //delete modal
    const [showModalDelete, setShowModalDelete] = useState(false);
    //cook now modal
    const [showModalCookNow, setShowModalCookNow] = useState(false);
    const [selectedRecipeForCookNow, setSelectedRecipeForCookNow] = useState(null);

    //modal recipe
    const openModalRecipe = () => {
        setShowModalRecipe(true)
    }
    const closeModalRecipe = () => {
        setShowModalRecipe(false)
    }

    //modal Ingredient
    const openModalIngredient = () => {
        setShowModalIngredient(true)
    }
    const closeModalIngredient = () => {
        setShowModalIngredient(false)
    }

    //modal cook now
    const openModalCookNow = (recipe) => {
        setSelectedRecipeForCookNow(recipe);
        setShowModalCookNow(true)
    }
    const closeModalCookNow = () => {
        setShowModalCookNow(false)
    }

    //modal delete
    const openModalDelete = (recipe) => {
        setSelectedRecipeForCookNow(recipe);
        setShowModalDelete(true)
    }
    const closeModalDelete = () => {
        setShowModalDelete(false)
    }


    //select ingredient you
    const addToRecipeIngredients = (ingredient) => {
        setIngredients(ingredients.filter((item) => item !== ingredient));
        setRecipeIngredients([...recipeIngredients, ingredient])
    }

    const removeFromRecipeIngredients = (ingredient) => {
        setRecipeIngredients(recipeIngredients.filter((item) => item !== ingredient));
        setIngredients([...ingredients, ingredient])
    }

    //alphabetical sort
    //ingredients
    const sortIngredientsByName = (a, b) => a.ingredientName.localeCompare(b.ingredientName);
    const sortedIngredients = [...ingredients].sort(sortIngredientsByName);

    //recipe ingredient or selected ingredient
    const sortRecipeIngredientsByName = (a, b) => a.ingredientName.localeCompare(b.ingredientName);
    const sortedRecipeIngredients = [...recipeIngredients].sort(sortRecipeIngredientsByName);


  return (
    <div className="container mt-4 cookbook-table">
        {
            user && (
                <h2>{user && user.name ? user.name.split(' ')[0] + ' Cookbook Test' : 'User Cookbook Test'}</h2>
                // <h2>{user.name.split(' ')[0]} Cookbook Test</h2>
            )
        }
        <button className="btn btn-success" onClick={openModalRecipe}>
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
            {' '}
            Add Recipe
        </button>


        {/* modal table recipe */}
        <Modal show={showModalRecipe} onHide={closeModalRecipe}>
            <Modal.Header closeButton>
                <Modal.Title>Add Recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="recipeName">
                    <Form.Label>Name of Recipe</Form.Label>
                    <Form.Control
                    type="text"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="ingredientName">
                    <button className="btn btn-success mt-2" onClick={openModalIngredient}>
                        <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                        {' '}
                        Add Ingredient
                    </button>
                </Form.Group>

                <Row className='mt-4'>
                    <Col>
                        <h5>Ingredients</h5>
                        <div className='scrollable-table-modal'>
                            <ListGroup>
                                {
                                    sortedIngredients.map((ingredient, index) => (
                                        <ListGroup.Item key={index} action onClick={() => addToRecipeIngredients(ingredient)}>
                                            {ingredient.ingredientName}
                                        </ListGroup.Item>
                                    ))
                                }
                            </ListGroup>
                        </div>
                    </Col>
                    <Col>
                        <h5>Selected Ingredients</h5>
                        <div className='scrollable-table-modal'>
                            <ListGroup>
                            {
                                sortedRecipeIngredients.map((ingredient, index) => (
                                    <ListGroup.Item key={index} action onClick={() => removeFromRecipeIngredients(ingredient)}>
                                        {ingredient.ingredientName}
                                    </ListGroup.Item>
                                ))
                            }
                            </ListGroup>
                        </div>
                    </Col>
                </Row>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModalRecipe}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSaveRecipe}>
                    Save Recipe
                </Button>
            </Modal.Footer>
        </Modal>


        {/* modal table ingredients */}
        <Modal show={showModalIngredient} onHide={closeModalIngredient}>
            <Modal.Header closeButton>
                <Modal.Title>Add Ingredient</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="ingredientName">
                    <Form.Label>Name of Ingredient</Form.Label>
                    <Form.Control
                    type="text"
                    value={ingredientName}
                    onChange={(e) => setIngredientName(e.target.value)} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModalIngredient}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSaveIngredient}>
                    Save Ingredient
                </Button>
            </Modal.Footer>
        </Modal>


        {/* table of cookbook */}
        <table className="table mt-2">
            <thead>
                <tr className='table-success'>
                    <th>Name</th>
                    <th>Ingredients</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    recipes.map((recipe) => (
                        <tr key={recipe._id}>
                            <td>{recipe.recipeName}</td>
                            <td>
                                {
                                    recipe.ingredients.map((ingredient, index) => (
                                        <span key={index}>
                                            {ingredient.ingredient.ingredientName}
                                            {index < recipe.ingredients.length - 1 ? ', ' : ''}
                                            {(index + 1) % 4 === 0 && index + 1 !== recipe.ingredients.length ? <br /> : null}
                                        </span>
                                    ))
                                }
                            </td>
                            <td>
                                <button className="btn btn-success mr-2"
                                // onClick={() => onViewRecipe(recipe.recipeName, recipe.ingredients, recipeIngredients)}
                                onClick={() => openModalCookNow(recipe)} >
                                <FontAwesomeIcon icon={faForward} className="mr-1" />
                                {' '}
                                    Cook Now
                                </button>
                                {' '}
                                <button className="btn btn-danger" onClick={() => openModalDelete(recipe)} >
                                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                    {' '}
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>

        {/* modal cook now */}
        <Modal show={showModalCookNow} onHide={closeModalCookNow}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Cook Now</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to cook now?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModalCookNow}>
                  No
                </Button>
                <Button variant="danger" onClick={() => {
                    onViewRecipe(
                        selectedRecipeForCookNow.recipeName, 
                        selectedRecipeForCookNow.ingredients, 
                        recipeIngredients
                    )
                    closeModalCookNow()
                    }}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>

        {/* modal delete */}
        <Modal show={showModalDelete} onHide={closeModalDelete}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModalDelete}>
                    No
                </Button>
                <Button variant="danger" onClick={() => handleDeleteRecipe(
                    selectedRecipeForCookNow._id)}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}
