function Food() {
    const food1 = "Pizza";
    const food2 = "Burger";
    const food3 = "Pasta";

    return ( 
            <ul>
                <li>{food1}</li>
                <li>{food2}</li>
                <li>{food3.toUpperCase()}</li>
            </ul>
    ); 
}

export default Food;

/*

function Food() {
    const food1 = "Pizza";
    const food2 = "Burger";
    const food3 = "Pasta";

    return ( 
        <div>
            <h2>My Favorite Foods</h2>
            <ul>
                <li>{food1}</li>
                <li>{food2}</li>
                <li>{food3}</li>
            </ul>
        </div>
    ); 
}

export default Food;*/ 