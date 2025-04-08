import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  navy: {
    backgroundColor: '#743603',
  },
  top: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2), 
  },
  red: {
    backgroundColor: '#743603',
    color: '#ffffff',
  },
  main: {
    flex: 1,
    overflow: 'auto',
    flexDirection: 'column',
    display: 'flex',
    color: '#ffffff',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#000000',
  },
  green: {
    backgroundColor: '#ffffff',
  },
  green1: {
    backgroundColor: '#5ced73',
  },
  largeLogo: {
    height: 100,
  },
  logo: {
    height: 50,
    marginRight: theme.spacing(2),
  },
  cards: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 10,
    maxWidth: '100%',
  },
  title: {
    marginTop: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWithTitle: {
    display: 'flex',
    alignItems: 'top',
    marginTop: theme.spacing(2),
  },
  space: {
    padding: 10,
  },
  media: {
    width: 200,
  },
  largeButton: {
    width: '250px',
    height: '40px',
    padding: '8px 16px',
    fontSize: '16px',
  },
  largeInput: {
    width: '60px!important',
    padding: '0!important',
    fontSize: '35px!important',
    textAlign: 'center!important',
  },
  bordered: {
    borderWidth: 2,
    borderRadius: 5,
    margin: 5,
    borderStyle: 'solid',
  },
  row: {
    display: 'flex',
    padding: 10,
  },
  around: {
    justifyContent: 'space-around',
  },
  between: {
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
  PlaceCupScreen: {
    backgroundImage: `url('../imagess/coffee-cup.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center-bottom',
    color: '#ffffff',
  },
  placeCupText: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    fontSize: '1.3rem',
    fontWeight: 'italic',
  },
  emojiContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  emojiButton: {
    position: 'absolute',
    fontSize: '2rem',
    color: '#ff1744',
    pointerEvents: 'auto',
  },
  emoji: {
    display: 'inline-block',
    fontSize: '2rem',
  },
}));
