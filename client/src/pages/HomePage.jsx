import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import CookBookTable from '../components/CookBookTable'
import CookingTable from "../components/CookingTable"
import { UserContext } from '../../contexts/userContext';

export default function HomePage() {
    const [recipeName, setRecipeName] = useState('');
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const storedRecipe = JSON.parse(localStorage.getItem('selectedRecipe')) || {};
        setRecipeName(storedRecipe.name || '');
        setRecipeIngredients(storedRecipe.ingredients || []);
    }, [])

    const handleViewRecipe = (name, ingredients) => {
        setRecipeName(name);
        setRecipeIngredients(ingredients);
      
        const selectedRecipe = {
            name,
            ingredients,
            selectedBy: user,
        };
      
        localStorage.setItem('selectedRecipe', JSON.stringify(selectedRecipe));
    }

    const handleDeleteRecipe = () => {
        setRecipeName('');
        setRecipeIngredients([]);

        localStorage.removeItem('selectedRecipe');
    }


  return (
    <>
    <Navbar />
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-9 mb-4">
                    <CookBookTable onViewRecipe={handleViewRecipe} onDeleteRecipe={handleDeleteRecipe} />
                </div>
                <div className="col-md-3">
                    <div className="sticky-top">
                        <CookingTable recipeName={recipeName} recipeIngredients={recipeIngredients} />
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

