import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/authContext';
import clsx from 'clsx'
import {
  makeStyles,
  useTheme,
  Grid,
  Button,
  IconButton,
  Divider,
  Typography,
  Toolbar,
  AppBar,
  CssBaseline,
  fade,
  Menu,
  MenuItem,
  TextField,
  InputBase,
  InputAdornment
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import DrawerButton from '../components/drawer'
import AccountCircle from '@material-ui/icons/AccountCircle';
import { deepOrange } from '@material-ui/core/colors';
import { auth } from 'firebase';
import { GET_POSTS, ALL_USERS } from '../graphql/queries';
import { top100Films } from '../constants'


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    //display: 'flex',
    flexGrow: 1
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
    width: '50%',
  },
  input: {
    //color: "black"
  },
  textfield: {
    borderRadius: '5px',
    margin: '2px',
    background: "white"
  },
  // search: {
  //   position: 'relative',
  //   color: 'white',
  //   borderRadius: theme.shape.borderRadius,
  //   backgroundColor: fade(theme.palette.common.white, 0.15),
  //   '&:hover': {
  //     backgroundColor: fade(theme.palette.common.white, 0.25),
  //   },
  //   marginLeft: 0,
  //   width: '100%',
  //   [theme.breakpoints.up('sm')]: {
  //     marginLeft: theme.spacing(1),
  //     width: 'auto',
  //   },
  // },
  // searchIcon: {
  //   padding: theme.spacing(0, 2),
  //   height: '100%',
  //   position: 'absolute',
  //   pointerEvents: 'none',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  inputRoot: {
    color: 'inherit',
  },

  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },

}));

const MyAppBar = (props) => {

  const classes = useStyles()
  //const theme = useTheme()
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState(null);
  const { state, dispatch } = useContext(AuthContext);

  const { data: posts } = useQuery(GET_POSTS)
  const { data: users } = useQuery(ALL_USERS);
  const { user } = state;
  //const [posts, setPosts] = useState()
  //const [searchData, setSearchData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [inputValue, setInputValue] = useState('')

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isMenuOpen = Boolean(anchorEl);

  // const options = top100Films.map((option) => {
  //   const firstLetter = option.title[0].toUpperCase();
  //   return {
  //     firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
  //     ...option,
  //   };
  // });

  // useEffect(() => {
  //   if (searchValue) {
  //     //console.log(searchValue)
  //     history.push(`/${searchValue.type.toLowerCase()}/${searchValue.id}`)
  //   }
  // }, [searchValue])


  const searchClickHandler = (item) => {
    //console.log("item : ", item)
    history.push(`/${item.type.toLowerCase()}/${item.id}`)
    setInputValue('')
  }

  // useEffect(() => {
  //   if (posts) {
  //     setSearchData([
  //       ...searchData,
  //       ...posts.posts
  //     ])
  //   }
  // }, [posts])

  // useEffect(() => {
  //   if (users) {
  //     setSearchData([
  //       ...searchData,
  //       ...users.allUsers
  //     ])
  //   }
  // }, [users])

  let searchOption = []
  if (posts && users) {
    searchOption = posts.posts.concat(users.allUsers).map(item => {
      if (item.username) {
        const firstLetter = item.username[0].toUpperCase();
        return {
          type: 'User',
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          content: item.username,
          subContent: "",
          id: item.username
        }
      }
      else {
        const firstLetter = item.title[0].toUpperCase();
        return {
          type: 'Post',
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          content: item.title,
          subContent: `@${item.postedBy.username}`,
          id: item._id
        }
      }
    })
  }

  //console.log("searchData : ", searchData)

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const menuClickHandler = (path) => {
    setAnchorEl(null);
    handleMobileMenuClose();
    history.push(path)
  }

  const logout = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    auth().signOut();
    dispatch({
      type: 'LOGGED_IN_USER',
      payload: null
    });
    history.push('/login');
  };
  //console.log("user : ", user)

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {user && <MenuItem style={{ cursor: 'default' }}>
        <Typography variant="h6" color="primary">{user.email}</Typography>
      </MenuItem>}
      <MenuItem onClick={() => menuClickHandler('/profile')}>Profile</MenuItem>
      <MenuItem onClick={() => menuClickHandler('/post/create')}>Create Post</MenuItem>
      <MenuItem onClick={() => menuClickHandler('/post/liked')}>Liked Posts</MenuItem>
      <MenuItem onClick={() => menuClickHandler('/post/userpost')}>My Posts</MenuItem>
      <Divider />
      <MenuItem onClick={logout}>
        <Typography variant="button" color="secondary">LOGOUT</Typography>
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem> */}
      <MenuItem>
        <Typography>Username</Typography>
      </MenuItem>
      <MenuItem onClick={() => menuClickHandler('/profile')}>Profile</MenuItem>
      <MenuItem onClick={() => menuClickHandler('/post/create')}>Create Post</MenuItem>
      <MenuItem onClick={() => menuClickHandler('/post/liked')}>Liked Posts</MenuItem>
      <MenuItem onClick={() => menuClickHandler('/post/userpost')}>Your Posts</MenuItem>
      <Divider />
      <MenuItem onClick={logout}>
        <Typography variant="button" color="secondary">LOGOUT</Typography>
      </MenuItem>
    </Menu>
  )
  //console.log("searchOption : ", searchOption)
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={
          clsx(classes.appBar, { [classes.appBarShift]: open, })
        }
      >
        <Toolbar>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Grid container justify="center" alignItems="center">
                <Grid item>
                  <DrawerButton />
                </Grid>
                <Grid item>
                  <Typography style={{ cursor: 'pointer' }} onClick={() => history.push("/")} variant="h5">MERN</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* {data &&
            <div style={{ width: '300px' }}>
              {<Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable={false}
                renderOption={(item) => <Typography onClick={() => history.push(`/post/${item._id}`)} >{item}</Typography>}
                options={data.posts.map((post) => post.content)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search"
                    margin="normal"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    //variant="outlined"
                    InputProps={{ ...params.InputProps, type: 'search' }}
                  />
                )} />}
            </div>} */}
          {/* <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div> */}
          {searchOption.length > 0 &&
            <Autocomplete
              noOptionsText={`Not Found`}
              inputValue={inputValue}
              className={classes.search}
              id="grouped-demo"
              getOptionSelected={(option, value) => option.content === value.content}
              //getOptionSelected={(option, value) => option === value}
              disableClearable={true}
              //onInputChange={() => { }}
              onChange={(e, value, reason) => searchClickHandler(value)}
              options={searchOption.sort((a, b) => -b.type.localeCompare(a.type))}
              groupBy={(option) => option.type}
              getOptionLabel={(option) => `${option.content}${option.subContent && option.subContent}`}
              renderInput={(params) => {
                //console.log("params : ", params)
                return <TextField
                  color="primary"
                  size="small"
                  placeholder="Search"
                  onChange={e => setInputValue(e.target.value)}
                  className={classes.textfield}
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    className: classes.input,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          style={{ color: 'grey' }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  label=""
                />
              }}
            />}
          <div className={classes.sectionDesktop}>
            {user
              ? <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit">
                <AccountCircle />
              </IconButton>
              : <div style={{ marginLeft: '10px' }}><Button variant="contained" color="secondary" onClick={() => history.push("/login")}>Login</Button></div>}
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

export default MyAppBar
