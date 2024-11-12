import React,{useState} from 'react';
import { Menu, MenuItem, Button, ListItemIcon, ListItemText } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PeopleIcon from '@mui/icons-material/People';
import { useSelector } from 'react-redux';
import './joined.css'; 
import card from '../assets/card1.svg';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CheckIcon from '@mui/icons-material/Check';

const classes = [
    {
      name: 'English',
      students: 45,
    },
    {
      name: 'Maths',
      students: 45,
    },
    {
      name: 'Science',
      students: 45,
    },
    {
      name: 'Science',
      students: 45,
    },
    {
      name: 'Science',
      students: 45,
    },
  ];
  const ClassCard = ({ name, students, index }) => {
    return (
      <div
        className={`bg-white rounded-lg p-3 flex flex-col justify-between border border-teal-200 w-[240px] h-[200px] fade-in-up mt-7`}
        style={{ animationDelay: `${index * 0.2}s` }} 
      >
        <div className="bg-[#919F9E] rounded-lg relative flex justify-between items-start h-fit p-5">
          <img src={card} alt={`${name} Class`} className="rounded-t-lg w-fit h-fit object-cover" />
          <MoreHorizIcon className="absolute top-2 right-2 text-white cursor-pointer" />
        </div>
        <div className="mt-2">
          <h3 className="text-2xl ">{name}</h3>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <PeopleIcon fontSize="small" />
            <span>{students}</span>
          </div>
        </div>
      </div>
    );
  };
  
const CreatedClasses =()=> {
    const sidebarWidth = useSelector((state) => state.sidebar.width);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSort, setSelectedSort] = useState('Recent Activity');

    // Options for sorting
    const sortOptions = ['Recent Activity', 'Date Created', 'Class Name'];

    // Open the menu
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close the menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle menu item click
    const handleMenuItemClick = (option) => {
        setSelectedSort(option);
        handleClose();
    };

    return (
      <div className="p-8 bg-[#E1EAE8] min-h-screen" style={{ marginLeft: sidebarWidth, transition: 'margin-left 0.3s ease' }}>
        <h2 className="text-3xl font-semibold mb-4 mt-9">Your Created Classes</h2>
        <div className="flex items-center mb-4">
          <span className="text-lg  mr-[5px]">Sort by:</span>
          <Button 
                    onClick={handleClick}
                    endIcon={anchorEl ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0',
                        minWidth: 'auto',
                        textTransform: 'none',
                        fontWeight: '600',
                        color: '#4C5858',
                        backgroundColor:'#D9DEDE',
                        paddingLeft:'5px',
                        paddingRight:'5px',
                        fontSize:'16px',
                        width:'150px'
                    }}
                >
                    {selectedSort}
                </Button>

            {/* Dropdown Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                    sx: {
                        backgroundColor :'#D9DEDE',
                        borderRadius: '5px',
                        fontWeight: '600',
                        color: '#4C5858',
                    },
                }}
            >
                {sortOptions.map((option) => (
                    <MenuItem
                        key={option}
                        onClick={() => handleMenuItemClick(option)}
                        selected={option === selectedSort}
                        sx={{ minWidth: 150,
                          '&.Mui-selected': {
                              backgroundColor: 'transparent'},
                            

                         }}
                    >
                        <ListItemText
                        sx={{
                          fontSize:'16px',
                          fontWeight:'500',
                        }}>{option}</ListItemText>
                        {option === selectedSort && (
                            <ListItemIcon>
                                <CheckIcon fontSize="20px"  />
                            </ListItemIcon>
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </div>
        <div className="flex flex-wrap gap-6 ">
          {classes.map((classInfo, index) => (
            <ClassCard key={index} {...classInfo} index={index} />
          ))} 
        </div>
      </div>
    );
}

export default CreatedClasses;
