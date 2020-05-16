/* eslint-disable material-ui/no-hardcoded-labels */
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import copyright from '../genericFiles/copyright';
import {Box, Icon} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import GitHub from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import Grid from "@material-ui/core/Grid";
import DescriptionIcon from '@material-ui/icons/Description';

const styles = (theme) => ({
    root: {
        marginTop: theme.spacing(2),
    },
    footer: {
        padding: theme.spacing(4),
    },
});

function AppFooter(props) {
    const {classes} = props;
    return (
        <div className={classes.root}>
            <Container maxWidth="md">
                <footer className={classes.footer}>
                    <copyright.Copyright/>
                    <Grid container={"main"} direction={"row"} justify={"center"} className={classes.footer}>
                        <Box>
                            <Typography variant="body2" color="textSecondary" align="center">
                                <Link color="inherit" href="https://github.com/pariharrahul1998/EHR-Hyperledger-Fabric">
                                    <Icon>
                                        <GitHub/>
                                    </Icon>
                                </Link>
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="textSecondary" align="center">
                                <Link color="inherit" href="https://www.linkedin.com/in/rahul-parihar-b0a19a135/">
                                    <Icon>
                                        <LinkedInIcon/>
                                    </Icon>
                                </Link>
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="textSecondary" align="center">
                                <Link color="inherit" href="https://www.facebook.com/rahul.parihar.5817300">
                                    <Icon>
                                        <FacebookIcon/>
                                    </Icon>
                                </Link>
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="textSecondary" align="center">
                                <Link color="inherit" href="https://www.instagram.com/_rahul_parihar/?hl=en">
                                    <Icon>
                                        <InstagramIcon/>
                                    </Icon>
                                </Link>
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="textSecondary" align="center">
                                <Link color="inherit"
                                      href="https://docs.google.com/document/d/1z9xBDGLz1OxliEGDs1Rz8AlzAKvGS8a0KAHZlOiyWbI/edit">
                                    <Icon>
                                        <DescriptionIcon/>
                                    </Icon>
                                </Link>
                            </Typography>
                        </Box>
                    </Grid>
                </footer>
            </Container>
        </div>
    );
}

AppFooter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppFooter);