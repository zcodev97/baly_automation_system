import { Outlet, Link } from "react-router-dom";

function CustomNavItem({
  title,
  route,
  className = "text-white border border-light p-1 rounded",
  style,
  onClick,
}) {
  return (
    <>
      <li className="nav-item " style={style}>
        <Link
          className={className}
          to={route}
          onClick={onClick}
          style={{ textDecoration: "none" }}
        >
          <b> {title} </b>
        </Link>
      </li>
      {/* Divider */}
      <li className="nav-item">
        <div className="container p-1 m-1"></div>
      </li>
    </>
  );
}
export default CustomNavItem;
// {
//   // username === "test" ? { display: "none" } : { display: "block" }
// }
