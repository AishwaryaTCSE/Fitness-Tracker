// Javascript for page displaying info related to a menu item
import Navbar from "../../components/navbar/navbar";
import "./foodInfo.scss";
import { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { AuthContext } from "../../utils/authentication/auth-context";
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import axios from "axios";
import Button from '@mui/material/Button';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
// Import styled from MUI for creating custom components
import { styled } from '@mui/material/styles';

const StyledTypography = styled(Typography)({
    color: 'white',
});

const StyledPaper = styled(Paper)({
    background: '#0b0b0b',
    width: .4,
    maxHeight: 400,
    position: 'relative',
    float: 'left',
    display: 'inline',
    ml: 6,
    top: 85,
    borderRadius: 2.5,
    overflow: 'auto',
});

const StyledListItem = styled(ListItem)({
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

const StyledButton = styled(Button)({
    backgroundColor: 'goldenrod',
    color: 'white',
    '&:hover': {
        backgroundColor: '#daa520',
    },
});

const StyledBoxContainer = styled(Box)({
    width: '35%',
    height: 'auto',
    overflow: 'hidden',
    position: 'absolute',
    marginLeft: '6%',
    marginTop: '63px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px'
});

// FIX: Define StyledFormControl
const StyledFormControl = styled(FormControl)({
    // Add custom styles for FormControl if needed, or leave empty to inherit
});

const FoodInfo = () => {
    const [starClick1, setStarClick1] = useState(false);
    const [starClick2, setStarClick2] = useState(false);
    const [starClick3, setStarClick3] = useState(false);
    const [starClick4, setStarClick4] = useState(false);
    const [starClick5, setStarClick5] = useState(false);
    const [savedClick, setSavedClick] = useState(false);
    const [score, setScore] = useState(0); // tracks users rating of item
    // FIX: Declare avg and setAvg
    const [avg, setAvg] = useState("N/A"); // tracks avg rating
    const { user } = useContext(AuthContext);
    const userId = user._id;
    let { menuItemID } = useParams();
    const [menuItem, setMenuItem] = useState({
        _id: "",
        ID: "",
        name: "",
        courtData: [],
        dateServed: "",
        isVegetarian: false,
        allergens: [],
        nutritionFacts: [],
        ingredients: "",
        __v: 0
    }); //tracks menu item

    // Handlers for star clicks remain the same...
    const handleClick0 = () => {
        setStarClick1(false);
        setStarClick2(false);
        setStarClick3(false);
        setStarClick4(false);
        setStarClick5(false);
    }
    const handleClick1 = () => {
        setStarClick1(true);
        setStarClick2(false);
        setStarClick3(false);
        setStarClick4(false);
        setStarClick5(false);
    }
    const handleClick2 = () => {
        setStarClick1(true);
        setStarClick2(true);
        setStarClick3(false);
        setStarClick4(false);
        setStarClick5(false);
    }
    const handleClick3 = () => {
        setStarClick1(true);
        setStarClick2(true);
        setStarClick3(true);
        setStarClick4(false);
        setStarClick5(false);
    }
    const handleClick4 = () => {
        setStarClick1(true);
        setStarClick2(true);
        setStarClick3(true);
        setStarClick4(true);
        setStarClick5(false);
    }
    const handleClick5 = () => {
        setStarClick1(true);
        setStarClick2(true);
        setStarClick3(true);
        setStarClick4(true);
        setStarClick5(true);
    }

    /* fields for meal type */
    const SELECT_MEAL = 'Select Meal Type';
    const BREAKFAST = 'Breakfast';
    const LUNCH = 'Lunch';
    const DINNER = 'Dinner';
    const SNACK = 'Snack';
    const [mealType, setMealType] = useState(SELECT_MEAL);

    /* Servings for adding to tracker*/
    const [servings, setServings] = useState("");

    /* Handles changing the mealtype */
    const handleMeals = (event) => {
        setMealType(event.target.value);
    };

    /* Message fields needed for determining error and success messages when saving item to tracker*/
    const MESSAGES = {
        INCOMPLETE_FIELDS_ERROR: 'Please enter all fields first',
        SUCCESSFUL_MESSAGE: 'Successfully added to tracker'
    }
    const [message, setMessage] = useState(MESSAGES.INCOMPLETE_FIELDS_ERROR);
    const [allFieldsComplete, setAllFieldsComplete] = useState(true);
    const [success, setSuccess] = useState(false);
    /* Text colors */
    const RED = "red";
    const WHITE = "white";
    const [messageColor, setMessageColor] = useState(RED);


    /* Clears success message after 5 seconds*/
    useEffect(() => {
        if (!success) {
            return;
        }
        const timer = setTimeout(() => {
            setSuccess(false);
        }, 5000);
        return () => clearTimeout(timer); // Cleanup function
    }, [success]);

    // remove's the last 'g' from a field
    function removeUnit(str) {
        if (typeof str === 'string' && str.endsWith('g')) {
            str = str.slice(0, -1);
        }
        return str;
    }

    /* Handles adding food to tracker*/
    const handleAddToTracker = async () => {
        setAllFieldsComplete(true);

        /* check if all fields were entered */
        if (servings === '' || mealType === SELECT_MEAL) {
            setAllFieldsComplete(false);
            setMessageColor(RED);
            setMessage(MESSAGES.INCOMPLETE_FIELDS_ERROR);
            return;
        }

        /* Get all fields of current item */
        const foodName = menuItem.name;
        let calories = 0;
        let protein = 0;
        let carbohydrates = 0;
        let fat = 0;
        let servingSize = 0;

        menuItem.nutritionFacts.forEach((fact) => {
            if (fact.Name === 'Serving Size') {
                servingSize = fact.LabelValue;
            } else if (fact.Name === 'Calories' && fact.LabelValue !== '') {
                calories = fact.LabelValue;
            } else if (fact.Name === 'Protein' && fact.LabelValue !== '') {
                protein = removeUnit(fact.LabelValue);
            } else if (fact.Name === 'Total Carbohydrate' && fact.LabelValue !== '') {
                carbohydrates = removeUnit(fact.LabelValue);
            } else if (fact.Name === 'Total fat' && fact.LabelValue !== '') {
                fat = removeUnit(fact.LabelValue);
            }
        });

        // console.log statements omitted for brevity
        try {
            await axios.put(`/users/addFood/${userId}`,
                { foodName, calories, fat, protein, carbohydrates, servings, servingSize, mealType },
                { headers: { token: `Bearer ${user.accessToken}` } }
            );

            // Clear the states and set successful to true to display message
            setServings('');
            setMealType(SELECT_MEAL);
            setSuccess(true);
            setMessageColor(WHITE);
            setMessage(MESSAGES.SUCCESSFUL_MESSAGE);

            console.log(`Saved item with ${menuItem.name} to tracker!`);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Load initial ratings & get item & get saved item on page render
     */
    const isFirstRenderRatings = useRef(true);
    useEffect(() => {
        const setInitialRating = async () => {
            try {
                const response = await axios.get('/ratings/' + userId + '/' + menuItemID);
                let rating = response.data;
                console.log("rating is " + rating);

                if (rating === "No doc found") {
                    handleClick0();
                } else {
                    rating = response.data.rating;
                    switch (rating) {
                        default:
                        case 0: // Add case 0 for explicit logic
                            handleClick0();
                            break;
                        case 1:
                            handleClick1();
                            break;
                        case 2:
                            handleClick2();
                            break;
                        case 3:
                            handleClick3();
                            break;
                        case 4:
                            handleClick4();
                            break;
                        case 5:
                            handleClick5();
                            break;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        const getIntialAvgRating = async () => {
            try {
                const response = await axios.get(`/ratings/${menuItemID}`);
                const rating = response.data.avgRating;
                if (rating != null) setAvg(rating);
            } catch (error) { console.log(error) };
        };

        const getMenuItemInfo = async () => {
            try {
                const response = await axios.get(`/menuInfo/item/${menuItemID}`);
                const item = response.data;
                setMenuItem({
                    _id: item._id,
                    ID: item.ID,
                    name: item.name,
                    courtData: item.courtData,
                    dateServed: item.dateServed,
                    isVegetarian: item.isVegetarian,
                    allergens: item.allergens,
                    nutritionFacts: item.nutritionFacts,
                    ingredients: item.ingredients,
                    __v: item.__v,
                });
                console.log("Menu item info set for: " + item.name); // Log item.name instead of menuItem (which is stale)
            } catch (error) { console.log(error) };
        };

        const getSavedStatus = async () => {
            try {
                const response = await axios.get(`/saved/${userId}/${menuItemID}`);
                const savedStatus = response.data.saved;
                if (savedStatus != null) {
                    setSavedClick(savedStatus);
                }
            } catch (error) { console.log(error) };
        };

        if (isFirstRenderRatings.current) {
            if (menuItemID != null) {
                setInitialRating();
                getIntialAvgRating();
                getMenuItemInfo();
                getSavedStatus();
            }
            isFirstRenderRatings.current = false;
        }
        // eslint-disable-next-line
    }, [menuItemID]); // Added menuItemID to dependency array for clarity, though isFirstRender handles initial load

    /**
     * Update the rating in the database when rating changes
     */
    const isFirstRender_updateRatingsDB = useRef(true);
    useEffect(() => {
        if (isFirstRender_updateRatingsDB.current) {
            isFirstRender_updateRatingsDB.current = false;
            return;
        }

        const updateRatingInDB = async () => {
            /* skip updating rating if nothing is selected (0 rating is handled by setting 0) */
            var rating = 0;
            if (starClick5) rating = 5;
            else if (starClick4) rating = 4;
            else if (starClick3) rating = 3;
            else if (starClick2) rating = 2;
            else if (starClick1) rating = 1;
            
            // Only update if there's a rating 1-5 to prevent unnecessary calls when resetting to 0
            // The existing logic only updates if starClick1 is true, which forces a 1-5 rating.
            // If you want to store a 0 rating, remove the !starClick1 check in the original logic.
            // Keeping the original logic's intent here: if starClick1 is false, rating is 0, so skip update
            if (rating === 0) return; 

            try {
                await axios.post('/ratings', {
                    userId: userId,
                    menuItemID: menuItemID,
                    rating: rating
                });
                console.log("successfully updated rating of menuItemId: " + menuItemID);
            } catch (error) {
                console.log("failed to update rating: " + error);
            } finally {
                setScore(rating);
            }
        }
        if (menuItemID != null) {
            updateRatingInDB();
        }
        // eslint-disable-next-line
    }, [starClick1, starClick2, starClick3, starClick4, starClick5]);

    /* useEffect to udpate avg rating of menu item on page when user rates something */
    useEffect(() => {
        async function updateAvgRating() {
            try {
                const response = await axios.get('/ratings/' + menuItemID);
                setAvg(response.data.avgRating);
            } catch (error) {
                console.log("failed to update avg rating: " + error);
            }
        }
        updateAvgRating();
        // eslint-disable-next-line
    }, [score])

    /**
     * Update the savedStatus in the database when saved changes.
     */
    const isFirstRender_updateSavedDB = useRef(true);
    useEffect(() => {
        if (isFirstRender_updateSavedDB.current) {
            isFirstRender_updateSavedDB.current = false;
            return;
        }

        const updateSavedStatusInDB = async () => {
            try {
                await axios.post('/saved', {
                    userId: userId,
                    menuItemID: menuItemID,
                    saved: savedClick
                });
                console.log("successfully updated savedStatus of menuItemId: " + menuItemID);
            } catch (error) {
                console.log("failed to update savedStatus: " + error);
            }
        }

        if (menuItemID != null) {
            updateSavedStatusInDB();
        }
    }, [savedClick]);

    /* Get nutrition info */
    // FIX: Correctly close the JSX elements inside the map
    const nutrition = menuItem.nutritionFacts.map((fact) =>
        <StyledListItem key={fact.Name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <StyledTypography fontWeight="bold" style={{ color: 'white' }}>
                {fact.Name}
            </StyledTypography>
            <div>
                {fact.LabelValue}
            </div>
        </StyledListItem>
    );

    /* Dietary tag info functions - only defined, not used in JSX below */
    function vegTags(tag) {
        // ... (original logic)
    }

    function nonVegTags(tag) {
        // ... (original logic)
        return null;
    }


    return (
        <Box className="foodInfo" sx={{ minHeight: '100vh', backgroundColor: '#0b0b0b' }}>
            <Navbar />
            <StyledPaper sx={{
                width: .4,
                maxHeight: 400,
                position: 'relative',
                float: 'left',
                display: 'inline',
                ml: 6,
                top: 85,
                borderRadius: 2.5,
                overflow: 'auto',
            }}>
                <StyledBoxContainer sx={{
                    width: .35,
                    height: 'auto',
                    overflow: 'hidden',
                    position: 'absolute',
                    marginLeft: '6%',
                    marginTop: '63px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 10px'
                }}>
                    {/* FIX: Use StyledFormControl */}
                    <StyledFormControl error fullWidth sx={{ m: 1, width: 200, height: 50, marginTop: 0, marginBottom: .5 }}>
                        <InputLabel>Meal type</InputLabel>
                        <Select
                            id="demo-simple-select"
                            value={mealType}
                            label="Filter"
                            onChange={handleMeals}
                        >
                            <MenuItem value={SELECT_MEAL}>{SELECT_MEAL}</MenuItem>
                            <MenuItem value={BREAKFAST}>{BREAKFAST}</MenuItem>
                            <MenuItem value={LUNCH}>{LUNCH}</MenuItem>
                            <MenuItem value={DINNER}>{DINNER}</MenuItem>
                            <MenuItem value={SNACK}>{SNACK}</MenuItem>
                        </Select>
                    </StyledFormControl>
                    <span>
                        <StyledButton
                            variant="contained"
                            onClick={handleAddToTracker}
                            sx={{
                                backgroundColor: 'goldenrod',
                                color: 'white',
                                height: '50px',
                                paddingLeft: '10px',
                                paddingRight: '10px',
                                zIndex: '999',
                                '&:hover': {
                                    backgroundColor: '#daa520',
                                }
                            }}>
                            Add to Tracker
                        </StyledButton>
                    </span>
                </StyledBoxContainer>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '10px',
                    position: "absolute",
                    ml: 125, //left margin (percent of screen)
                    mt: 48, //top margin (percent of screen),
                    padding: 15,
                    borderRadius: 2.5,
                    width: 225,
                    visibility: (allFieldsComplete && !success) && "hidden",
                    color: messageColor
                }}>
                    <p> {message} </p>
                </Box>
                {/* Display Nutrition Facts */}
                <Box sx={{ ml: 6, mt: 70, width: .9, height: 'auto', position: 'absolute' }}>
                    {nutrition}
                    <Box sx={{
                        borderColor: '#242424',
                        p: 1,
                        m: 1,
                        borderRadius: 4,
                        border: '1px solid',
                        width: 1,
                        height: 'auto',
                        display: 'block',
                    }}>
                        <Typography fontWeight="bold">
                            Ingredients: &nbsp;
                        </Typography>
                        {menuItem.ingredients}
                    </Box>
                    <Box sx={{
                        borderColor: '#242424',
                        p: 1,
                        m: 1,
                        borderRadius: 4,
                        border: '1px solid',
                        height: 'auto',
                        width: 1,
                        display: 'block',
                    }}>
                        <Typography style={{ color: "#f74d40" }} fontWeight="bold" color='red'>
                            Disclaimer: &nbsp;
                        </Typography>
                        Menus subject to change. All nutritional information is based on the listed menu items. Any additions to ingredients or condiments will change the nutritional value. All information provided is believed to be accurate and reliable as of the date of posting. Nutritional information may vary by location due to product substitutions or product availability.
                    </Box>
                </Box>
            </StyledPaper>
        </Box>
    );
};

export default FoodInfo;