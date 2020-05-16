import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '../HomeFiles/Typography';
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import {Box} from "@material-ui/core";

const styles = (theme) => ({
    root: {
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: '#FFFFF5',
    },
    container: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
        display: 'flex',
        position: 'relative',
        padding: theme.spacing(5),
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(0, 5),
    },
    media: {
        height: 280,
    },
});

function TeamInfo(props) {
    const {classes} = props;

    return (

        <section className={classes.root}>
            <Container className={classes.container}>
                <Grid container={"main"} direction={"column"} spacing={2} alignItems={"center"}>
                    <Grid container spacing={5} align={"center"} justify={"center"}>
                        <Grid item xs={12}>
                            <Typography component="p" variant="h4" color="#000000" gutterBottom align='center'>
                                <b>Contributors</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Card className={classes.root} style={{maxWidth: 345}}>
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.media}
                                        image={require("../stockImages/sureshBabu.jpeg")}
                                        title="E. Suresh Babu"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Dr. E. Suresh Babu
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            (Assistant Professor)
                                            <br/>
                                            Department of Computer Science And Engineering, NIT Warangal

                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card className={classes.root} style={{maxWidth: 345}}>
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.media}
                                        image={require("../stockImages/vyshnavi.jpeg")}
                                        title="R.V.S.Vyshnavi"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            R.V.S.Vyshnavi
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            (167157)
                                            <br/>
                                            Department of Computer Science And Engineering, NIT Warangal
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card className={classes.root} style={{maxWidth: 345}}>
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.media}
                                        image={require("../stockImages/rahul.jpeg")}
                                        title="Rahul Parihar"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Rahul Parihar
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            (167150)
                                            <br/>
                                            Department of Computer Science And Engineering, NIT Warangal
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card className={classes.root} style={{maxWidth: 345}}>
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.media}
                                        image={require("../stockImages/satyateja.jpeg")}
                                        title="Pinnati Satyateja"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Pinnati Satyateja
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            (167147)
                                            <br/>
                                            Department of Computer Science And Engineering, NIT Warangal
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </section>
    );
}

TeamInfo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TeamInfo);