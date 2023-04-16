module.exports = {
    database:{
        user: "PROYECTO2",
        password: "p2123",
        connectString: "(DESCRIPTION=(LOAD_BALANCE = ON)(FAILOVER=ON)(ADDRESS =(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(ADDRESS=(PROTOCOL=TCP) (HOST=localhost)(PORT=1521))(CONNECT_DATE=(SERVICE_NAME=XE)(FAILOVER_MODE=(TYPE=SELECT)(METHOD=BASIC))))"
    }
};