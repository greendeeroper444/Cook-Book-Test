import axios from 'axios'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';

export default function CookingTable({ recipeName, recipeIngredients }) {
    const [checkedIngredients, setCheckedIngredients] = useState(new Map());

    const handleCheckboxChange = (ingredient) => {
        const updatedMap = new Map(checkedIngredients);
        const newCheckedState = !checkedIngredients.get(ingredient._id);

        updatedMap.set(ingredient._id, newCheckedState);
        setCheckedIngredients(updatedMap);

        //send the request to the server for permanent update
        axios.put(`/recipe-ingredient/update-recipe-ingredient/${ingredient._id}`, { 
            checked: newCheckedState 
        })
    }

    useEffect(() => {
        const fetchCheckedState = async() => {
            try {
                const checkedStateResult = await axios.get('/recipe-ingredient/get-checked-state');
                const checkedStateMap = new Map();

                checkedStateResult.data.forEach((ingredient) => {
                    checkedStateMap.set(ingredient._id, ingredient.checked)
                });

                setCheckedIngredients(checkedStateMap)
            } catch (error) {
                console.log(error)
            }
        }

        fetchCheckedState();
    }, [])



  return (
    <div className="container mt-4 cooking-table">
        <h2>Cooking</h2>
            {
                recipeIngredients && recipeIngredients.length > 0 && (
                    <div className='scrollable-table'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Current Recipe: &quot;{recipeName}&quot;</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    recipeIngredients && recipeIngredients.map((ingredient, index) => (
                                        <tr key={index} className={checkedIngredients.get(ingredient._id) ? 'table-primary' : ''}>
                                            <td>
                                                <div className="form-check">
                                                    <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`ingredientCheckbox${index}`}
                                                    checked={checkedIngredients.get(ingredient._id) || false}
                                                    onChange={() => handleCheckboxChange(ingredient)} />
                                                    <label className="form-check-label"
                                                    htmlFor={`ingredientCheckbox${index}`}></label>
                                                    {ingredient.ingredient.ingredientName}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )
            }
            {
                (!recipeIngredients || recipeIngredients.length === 0) && (
                    <p>No selected recipe</p>
                )
            }
    </div>
  )
}

CookingTable.propTypes = {
    recipeName: PropTypes.string.isRequired,
    recipeIngredients: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            ingredient: PropTypes.shape({
                ingredientName: PropTypes.string.isRequired,
            }).isRequired,
        })
    ).isRequired,
}