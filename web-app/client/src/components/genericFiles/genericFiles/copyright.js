import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import React from "react";


const copyright = {
    Copyright() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="/mediBlocks">
                    MediBlocks
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }
};


export {copyright as default}