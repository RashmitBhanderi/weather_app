import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(0.5)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "36ch",
      "&:focus": {
        width: "42ch",
      },
    },
  },
}));

const SearchAppBar = ({ onClick }) => {
  const [value, onChange] = useState("");
  return (
    <Search>
      <StyledInputBase
        placeholder="Enter the name of city..."
        value={value}
        onKeyDown={(e) => (e.key === "Enter" ? onClick(value) : undefined)}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ "aria-label": "search" }}
      />
      <IconButton onClick={() => onClick(value)}>
        <SearchIcon />
      </IconButton>
    </Search>
  );
};

export default SearchAppBar;
