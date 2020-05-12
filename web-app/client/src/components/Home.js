import React, {Component} from 'react';
import ProductCategories from "./HomeFiles/ProductCategories";
import AppAppBar from "./HomeFiles/AppAppBar";
import ProductHero from "./HomeFiles/ProductHero";
import ProductValues from "./HomeFiles/ProductValues";
import AppFooter from "./HomeFiles/AppFooter";

class Home extends Component {
    render() {
        return (
            <React.Fragment>
                <AppAppBar/>
                <ProductHero/>
                <ProductValues/>
                <ProductCategories/>
                <AppFooter/>
            </React.Fragment>
        );
    }
}

export default Home;