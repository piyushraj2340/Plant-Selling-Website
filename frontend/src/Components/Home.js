import React from 'react'
import Headers from "./Headers";
import Products from "./Products";

const Home = () => {
    document.title = "Plant Selling Website";
    return (
        <>
            <Headers />
            <Products />
        </>
    )
}

export default Home