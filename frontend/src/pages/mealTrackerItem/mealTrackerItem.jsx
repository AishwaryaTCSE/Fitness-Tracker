// Javascript for page displaying info related to a menu item
// import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/navbar";
import "./mealTrackerItem.scss";
import { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { AuthContext } from "../../utils/authentication/auth-context";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import Typography from '@mui/material/Typography';
import axios from "axios";
import Button from '@mui/material/Button';
// import ROUTES from "../../routes";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import ROUTES from "../../routes";
import { styled } from '@mui/material/styles';

// Styled Components
const StyledFormControl = styled(FormControl)({
    '& .MuiInputBase-root': {
        color: 'white',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-focused': {
            color: 'white',
        },
    },
    '& .MuiSvgIcon-root': {
        color: 'white',
    },
});

const StyledButton = styled(Button)({
    backgroundColor: 'goldenrod',
    color: 'white',
    '&:hover': {
        backgroundColor: '#daa520',
    },
});

const StyledBox = styled(Box)({
    background: '#0b0b0b',
    width: 0.4,
    maxHeight: 400,
    position: 'relative',
    float: 'left',
    display: 'inline',
    marginLeft: 6,
    top: 85,
    borderRadius: 5,
    overflow: 'auto',
});

const EditBox = styled(Box)({
    background: '#0b0b0b',
    width: 0.22,
    height: 500,
    position: 'relative',
    float: 'left',
    display: 'inline',
    marginLeft: 6,
    top: 85,
    borderRadius: 5,
    overflow: 'auto',
});

const MealTrackerItem = () => {
    const handleMealTypeChange = (event) => {
        setMealType(event.target.value);
    }
    const navigate = useNavigate();

    /* Food info corresponding to input boxes */
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbohydrates, setCarbs] = useState('');
    const [servings, setServings] = useState('');
    const [servingSize, setServingSize] = useState('');

    /* Meal types */
    const EMPTY = 'Choose meal type';
    const BREAKFAST = 'Breakfast';
    const LUNCH = 'Lunch';
    const DINNER = 'Dinner';
    const SNACK = 'Snack';
    const [mealType, setMealType] = useState(EMPTY);

    /* Mapping of different error messages. */
    const ERROR_MESSAGES = {
        INCOMPLETE_FIELDS_ERROR: 'Please enter all necessary fields before saving',
        INVALID_CALORIES_ERROR: "Calories must be a number",
        INVALID_PROTEIN_ERROR: "Protein must be a number",
        INVALID_CARBS_ERROR: "Carbohydrates must be a number",
        INVALID_FAT_ERROR: "Fat must be a number",
        INVALID_SERVINGS_ERROR: "Servings must be a number"
    }

    const [errorMessage, setErrorMessage] = useState(ERROR_MESSAGES.INCOMPLETE_FIELDS_ERROR);
    const [allFieldsComplete, setAllFieldsComplete] = useState(true); /* initialize to true to hide error message */

    const { user } = useContext(AuthContext);
    const userId = user._id;
    let { foodItemHash } = useParams(); // this will be undefined if no params
    const [foodItem, setFoodItem] = useState({
        foodName: "",
        calories: "",
        fat: "",
        protein: "",
        carbohydrates: "",
        servings: "",
        servingSize: "",
        mealType: "",
        hash: ""
    }); //tracks food item

    /**
    *   Get item on page render
    */
    const isFirstRender = useRef(true); // don't do anything on first render
    useEffect(() => {

        const getFoodItemInfo = async () => {
            try {
                const response = await axios.get(`/users/aFoodItem/${userId}/${foodItemHash}`,
                    { headers: { token: `Bearer ${user.accessToken}` } });
                const item = response.data;
                setFoodItem({
                    foodName: item.foodName,
                    calories: item.calories,
                    fat: item.fat,
                    protein: item.protein,
                    carbohydrates: item.carbohydrates,
                    servings: item.servings,
                    servingSize: item.servingSize,
                    mealType: item.mealType,
                    hash: item.hash
                });
                // console.log(response.data);
            } catch (error) { console.log(error) };
        };

        if (isFirstRender.current) {
            if (foodItemHash != null) {
                getFoodItemInfo();
            }
        }
        isFirstRender.current = false;
        // eslint-disable-next-line
    }, []);

    /**
     * Checks if a value is a number and is greater than 0
     * 
     * @param {*} str arbitrary input value
     * @returns true if the value is valid according to the requirements
     */
    function isValidNumber(str) {
        const num = parseFloat(str);
        return !isNaN(num) && num >= 0 && str.trim() === num.toString();
    }

    const handleEditFood = async () => {

        setAllFieldsComplete(true);

        /* check if at least one */
        if (foodName === '' || calories === '' || protein === '' || carbohydrates === '' || servings === '' || servingSize === '' || mealType === EMPTY) {
            setAllFieldsComplete(false);
            console.log(allFieldsComplete)
            setErrorMessage(ERROR_MESSAGES.INCOMPLETE_FIELDS_ERROR);
            return;
        }

        /* check if unit fields are numbers and >= 0 */
        if (!isValidNumber(calories)) {
            setAllFieldsComplete(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_CALORIES_ERROR);
            return;
        }
        if (!isValidNumber(protein)) {
            setAllFieldsComplete(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_PROTEIN_ERROR);
            return;
        }
        if (!isValidNumber(carbohydrates)) {
            setAllFieldsComplete(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_CARBS_ERROR);
            return;
        }
        if (!isValidNumber(fat)) {
            setAllFieldsComplete(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_FAT_ERROR);
            return;
        }
        if (!isValidNumber(servings)) {
            setAllFieldsComplete(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_SERVINGS_ERROR);
            return;
        }

        try {
            const hash = foodItemHash;
            await axios.put(
                `/users/editFood/${userId}`,
                { foodName, calories, fat, protein, carbohydrates, servings, servingSize, mealType, hash },
                { headers: { token: `Bearer ${user.accessToken}` } }
            );

            // Refresh the food items after editing
            setFoodItem({
                foodName: foodName,
                calories: calories,
                fat: fat,
                protein: protein,
                carbohydrates: carbohydrates,
                servings: servings,
                servingSize: servingSize,
                mealType: mealType,
                hash: foodItemHash
            });

            // Clear the previous state
            setFoodName('');
            setCalories('');
            setProtein('');
            setFat('');
            setCarbs('');
            setServings('');
            setServingSize('');
            setMealType(EMPTY);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteFood = async () => {
        try {
            const hash = foodItemHash;
            await axios.delete(
                `/users/deleteFood/${userId}/${hash}`,
                { headers: { token: `Bearer ${user.accessToken}` } }
            );
            
            navigate(ROUTES.MEAL_TRACKER, { state: { refresh: true } });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mealTrackerItem">
            <Navbar />

            <StyledBox>
                <List>
                    <ListItem sx={{
                        background: '#242424',
                        width: .98,
                        mx: 'auto',
                        borderRadius: 8,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Typography style={{ color: "#ebc034" }} fontWeight="bold">
                            Nutrition Facts for:
                        </Typography>
                        <Typography style={{ color: "#ebc034" }} fontWeight="bold">
                            {foodItem.foodName}
                        </Typography>
                    </ListItem>

                    <ListItem key="calories" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Calories</Typography>
                        <Typography>{foodItem.calories}</Typography>
                    </ListItem>
                    <ListItem key="protein" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Protein</Typography>
                        <Typography>{foodItem.protein}</Typography>
                    </ListItem>
                    <ListItem key="carbohydrates" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Carbohydrates</Typography>
                        <Typography>{foodItem.carbohydrates}</Typography>
                    </ListItem>
                    <ListItem key="fat" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Fat</Typography>
                        <Typography>{foodItem.fat}</Typography>
                    </ListItem>
                    <ListItem key="servings" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Servings</Typography>
                        <Typography>{foodItem.servings}</Typography>
                    </ListItem>
                    <ListItem key="servingSize" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Serving size</Typography>
                        <Typography>{foodItem.servingSize}</Typography>
                    </ListItem>
                    <ListItem key="mealType" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Meal Type</Typography>
                        <Typography>{foodItem.mealType}</Typography>
                    </ListItem>

                </List>

            </StyledBox>

            <EditBox>
                <List>
                    <ListItem sx={{
                        background: '#242424',
                        width: .98,
                        mx: 'auto',
                        borderRadius: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}>
                        <Typography fontWeight="bold">Edit Item:</Typography>
                        <div></div> {/* Empty div for spacing */}
                    </ListItem>

                    <ListItem key="name" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Food Name</Typography>
                        <input 
                            type="text" 
                            value={foodName} 
                            onChange={(e) => setFoodName(e.target.value)}
                            style={{
                                backgroundColor: '#333',
                                color: 'white',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                width: '120px'
                            }}
                        />
                    </ListItem>

                    <ListItem key="calories" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Calories</Typography>
                        <input 
                            type="number" 
                            value={calories} 
                            onChange={(e) => setCalories(e.target.value)}
                            style={{
                                backgroundColor: '#333',
                                color: 'white',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                width: '80px',
                                textAlign: 'right'
                            }}
                        />
                    </ListItem>

                    <ListItem key="fat" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Fat</Typography>
                        <input 
                            type="number" 
                            value={fat} 
                            onChange={(e) => setFat(e.target.value)}
                            style={{
                                backgroundColor: '#333',
                                color: 'white',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                width: '80px',
                                textAlign: 'right'
                            }}
                        />
                    </ListItem>

                    <ListItem key="protein" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Protein</Typography>
                        <input 
                            type="number" 
                            value={protein} 
                            onChange={(e) => setProtein(e.target.value)}
                            style={{
                                backgroundColor: '#333',
                                color: 'white',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                width: '80px',
                                textAlign: 'right'
                            }}
                        />
                    </ListItem>

                    <ListItem key="carbs" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Carbs</Typography>
                        <input 
                            type="number" 
                            value={carbohydrates} 
                            onChange={(e) => setCarbs(e.target.value)}
                            style={{
                                backgroundColor: '#333',
                                color: 'white',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                width: '80px',
                                textAlign: 'right'
                            }}
                        />
                    </ListItem>

                    <ListItem key="servings" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Servings</Typography>
                        <input 
                            type="number" 
                            value={servings} 
                            onChange={(e) => setServings(e.target.value)}
                            style={{
                                backgroundColor: '#333',
                                color: 'white',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                width: '80px',
                                textAlign: 'right'
                            }}
                        />
                    </ListItem>

                    <ListItem key="servingSize" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Servings Size</Typography>
                        <input 
                            type="text" 
                            value={servingSize} 
                            onChange={(e) => setServingSize(e.target.value)}
                            style={{
                                backgroundColor: '#333',
                                color: 'white',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                width: '120px'
                            }}
                        />
                    </ListItem>

                    <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight="bold">Meal Type:</Typography>
                        <Box sx={{ width: 180 }}>
                            <StyledFormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel>Meal Type</InputLabel>
                                <Select 
                                    id="meal-type-select" 
                                    value={mealType} 
                                    onChange={handleMealTypeChange} 
                                    label="Meal Type"
                                    sx={{
                                        color: 'white',
                                        '& .MuiSelect-icon': {
                                            color: 'white'
                                        }
                                    }}
                                >
                                    <MenuItem value={BREAKFAST}>{BREAKFAST}</MenuItem>
                                    <MenuItem value={LUNCH}>{LUNCH}</MenuItem>
                                    <MenuItem value={DINNER}>{DINNER}</MenuItem>
                                    <MenuItem value={SNACK}>{SNACK}</MenuItem>
                                </Select>
                            </StyledFormControl>
                        </Box>
                    </ListItem>

                    <ListItem sx={{ display: 'flex', justifyContent: 'center' }}>
                        <StyledButton
                            variant="contained"
                            onClick={handleEditFood}
                            sx={{
                                height: '50px',
                                paddingLeft: '10px',
                                paddingRight: '10px',
                                zIndex: '999',
                            }}>
                            Save Changes
                        </StyledButton>
                        <Button
                            variant="contained"
                            onClick={handleDeleteFood}
                            sx={{
                                backgroundColor: '#ff4444',
                                color: 'white',
                                height: '50px',
                                paddingLeft: '10px',
                                paddingRight: '10px',
                                marginLeft: '10px',
                                zIndex: '999',
                                '&:hover': {
                                    backgroundColor: '#cc0000',
                                }
                            }}>
                            Delete Item
                        </Button>
                    </ListItem>
                </List>

                { // error message if not all fields filled in
                    <div className="errorMessage">
                        <p style={{ visibility: (allFieldsComplete) && "hidden" }}>
                            {errorMessage}
                        </p>
                    </div>
                }
            </EditBox>



            <EditBox sx={{ 
                width: 0.2,
                maxHeight: 400,
                borderRadius: '10px',
            }}>
                <List>
                    <ListItem sx={{
                        background: '#242424',
                        width: .98,
                        borderRadius: 8,
                    }}>
                        <Typography fontWeight="bold" marginRight={1}>
                            {"Delete This Item: "}
                        </Typography>
                        <Link className="link" onClick={handleDeleteFood}>
                            <Button variant="contained" color="error" size="large" className="button"> Delete </Button>
                        </Link>
                    </ListItem>
                </List>
            </EditBox>
        </div>
    );
};

export default MealTrackerItem;