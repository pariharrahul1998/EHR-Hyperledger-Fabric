/* eslint-disable material-ui/no-hardcoded-labels */
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import copyright from '../genericFiles/copyright';

const styles = (theme) => ({
    root: {
        marginTop: theme.spacing(6),
    },
    footer: {
        padding: theme.spacing(3, 0),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(8, 0),
        },
    },
});

function AppFooter(props) {
    const {classes} = props;
    return (
        <div className={classes.root}>
            <Divider/>
            <Container maxWidth="md">
                <footer className={classes.footer}>
                    <copyright.Copyright/>
                </footer>
            </Container>
        </div>
    );
}

AppFooter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppFooter);