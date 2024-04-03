import { Pagination, Steps, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getOrderHistoryAsync } from '../orderSlice';
import formatTimestamp from '../../../utils/formatTimestamp';

const Order = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get('page');
    const orderSearch = searchParams.get('orderSearch');
    const [searchQuery, setSearchQuery] = useState('');

    const [orderPage, setOrderPage] = useState(page || 1);
    const [orderFilterByDate, setOrderFilterByDate] = useState(Date.now() - (3 * 30 * 24 * 60 * 60 * 1000)); //? Calculate milliseconds for the last 3 months
    const [activeTabs, setActiveTabs] = useState('order');
    const orderHistory = useSelector(state => state.order.orderHistory);
    const total = useSelector(state => state.order.totalData);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const noPlantsImage = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/no-data-found"

    useEffect(() => {
        const data = {
            page: orderPage,
            limit: 10,
            endDate: orderFilterByDate,
            orderSearch
        }

        dispatch(getOrderHistoryAsync(data));
    }, [])

    const itemRender = (_, type, originalElement) => {
        if (type === 'prev') {
            return <Link>Previous</Link>;
        }
        if (type === 'next') {
            return <Link>Next</Link>;
        }
        return originalElement;
    };

    const handelChangeOrderPage = (page) => {
        const data = {
            page: orderPage,
            limit: 10,
            endDate: orderFilterByDate,
            orderSearch
        }
        window.scrollTo(0, 0);
        setOrderPage(page);
        dispatch(getOrderHistoryAsync(data));

        if (orderSearch) {
            navigate(`/orders/history/?page=${page}&orderSearch=${orderSearch}`);
        } else {
            navigate(`/orders/history/?page=${page}`);
        }

    }

    const handelFilterOrderHistoryByDate = (e) => {
        switch (e.target.value) {
            case 'last6Months':
                setOrderFilterByDate(Date.now() - (6 * 30 * 24 * 60 * 60 * 1000));
                break;
            case 'last1Year':
                setOrderFilterByDate(Date.now() - (365 * 24 * 60 * 60 * 1000));
                break;
            case 'last2Years':
                setOrderFilterByDate(Date.now() - (2 * 365 * 24 * 60 * 60 * 1000));
                break;
            default:
                // Default case: Retrieve data for the last 3 months
                setOrderFilterByDate(Date.now() - (3 * 30 * 24 * 60 * 60 * 1000));
                break;
        }
    }

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handelOrderSearch = () => {
        if (searchQuery === "") {
            message.error("Search input must be specified");
            return;
        }
        const data = {
            page: 1,
            limit: 10,
            endDate: orderFilterByDate,
            orderSearch: searchQuery
        }

        window.scrollTo(0, 0);
        setOrderPage(1);
        dispatch(getOrderHistoryAsync(data));
        navigate(`/orders/history/?orderSearch=${searchQuery}`);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handelOrderSearch();
        }
      };

    return (
        <section className="bg-section">
            <div className="container p-2 p-md-3 p-lg-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/profile" className='link-underline-hover'>Profile</Link></li>
                        <li className="breadcrumb-item " aria-current="page">Your Orders</li>
                    </ol>
                </nav>
                <div className="row border-bottom my-2 pb-2">
                    <div className="d-flex flex-column flex-md-row p-2 justify-content-between py-2">
                        <h2 className='h2 px-2'>Your Orders</h2>
                        <div className="position-relative">
                            <div className="input-group position-relative">
                                <input
                                    type="search"
                                    name="order-search"
                                    className='form-control border-none p-2'
                                    style={{ boxShadow: "none" }}
                                    id="order-search"
                                    placeholder='Search your Order'
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                />
                                <button className='btn btn-info' onClick={handelOrderSearch}><span className="fas fa-search"></span> Search</button>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex border-bottom mb-2">
                        <div style={{ transform: "translateY(1px)" }}>
                            <button className={`p-2 ${activeTabs === 'order' ? 'border-bottom border-0 border-bottom-3 border-warning' : "border-0"}`} onClick={() => setActiveTabs('order')}>
                                Orders
                            </button>
                        </div>
                        <div style={{ transform: "translateY(1px)" }} >
                            <button className={`p-2 ${activeTabs === 'buy-again' ? 'border-bottom border-0 border-bottom-3 border-warning' : "border-0"}`} onClick={() => setActiveTabs('buy-again')}>
                                Incomplete Orders
                            </button>
                        </div>
                        <div style={{ transform: "translateY(1px)" }} >
                            <button className={`p-2 ${activeTabs === 'cancelled-orders' ? 'border-bottom border-0 border-bottom-3 border-warning' : "border-0"}`} onClick={() => setActiveTabs('cancelled-orders')}>
                                Cancelled Orders
                            </button>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <p className='p-2 m-0'>Total Order: <b>{total}</b></p>
                        <select name="filter-order" id="filter-order" className='p-1' onChange={(e) => handelFilterOrderHistoryByDate(e)}>
                            <option value="last3Months">Last 3 months</option>
                            <option value="last6Months">Last 6 months</option>
                            <option value="last1Year">Last 1 Years</option>
                            <option value="last2Year">Last 2 Years</option>
                        </select>
                    </div>
                </div>
                <div className="row d-flex justify-content-center align-items-center mb-4">
                    {orderHistory.length ?
                        orderHistory.map(order => {
                            return (
                                <div className="card mb-2 p-0" key={order._id}>
                                    <div className="card-header p-2 p-md-3">
                                        <div className="d-flex flex-column flex-md-row align-items-start justify-content-between align-items-md-center">
                                            <div>
                                                <p className="text-muted mb-2"> Order ID <span className="fw-bold text-body">{order._id}</span></p>
                                                <p className="text-muted mb-0"> Place On <span className="fw-bold text-body">{formatTimestamp(order.orderAt)}</span> </p>
                                            </div>
                                            <div className='mt-2 mt-md-0'>
                                                <h6 className="mb-0"> <Link to={`/orders/details/${order._id}`}>View Details </Link> </h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body p-3 p-md-4 mb-3">
                                        {
                                            order.orderItems.map(items => {

                                                const stepsOptions = [
                                                    {
                                                        title: order.payment.status === 'pending' ? "Order Pending" : "Order Placed",
                                                        icon: <span className='fas fa-clipboard-list'></span>,
                                                        description: <span className='text-muted'>{formatTimestamp(order.orderAt)} <br /> <i className="fw-bold">{order.payment.status === 'pending' && order.payment.message}</i></span>
                                                    },
                                                    {
                                                        title: 'Order Shipped',
                                                        icon: <span className='	fas fa-shipping-fast'></span>,
                                                        description: items.orderStatus.state === "shipped" && <span className='text-muted'>{formatTimestamp(items.orderStatus.statusAt)} <br /> {items.orderStatus.message}</span>
                                                    },
                                                    {
                                                        title: 'Order Delivered',
                                                        icon: <span className='fas fa-home'></span>,
                                                        description: items.orderStatus.state === "delivered" && <span className='text-muted'>{formatTimestamp(items.orderStatus.statusAt)} <br /> {items.orderStatus.message}</span>
                                                    },
                                                ]

                                                let activeStep = 0;

                                                if (items.orderStatus.status === 'delivered') {
                                                    activeStep = 2;
                                                } else if (items.orderStatus.status === 'shipped') {
                                                    activeStep = 1;
                                                } else {
                                                    activeStep = 0;
                                                }

                                                return (
                                                    <div key={items._id} className='mb-4 pb-4 border-bottom'>
                                                        <div className="d-flex flex-row">
                                                            <div className="flex-fill">
                                                                <h5 className="bold"><Link to={`/product/${items.plant}`} className='link-dark link-underline-hover'>{items.plantName}</Link></h5>
                                                                <p className="text-muted"> Qt: {items.quantity} {items.quantity > 1 ? "items" : "item"}</p>
                                                                <h4 className="mb-3"> ₹ {(items.price - items.discount / 100 * items.price).toFixed(2)} <span className="small text-muted"> via ({order.payment.paymentMethods}) </span></h4>
                                                                <p className="text-muted">Tracking Status on: <span className="text-body">{formatTimestamp(items.orderStatus.statusAt)}</span></p>
                                                            </div>
                                                            <div className='mb-4 rounded overflow-hidden' style={{ width: "200px" }}>
                                                                <img className="align-self-center img-fluid" src={items.images.url} width="250" alt="product" />
                                                            </div>
                                                        </div>
                                                        <Steps items={stepsOptions} current={activeStep} labelPlacement='vertical' />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="card-footer p-4">
                                        <div className="d-flex justify-content-between">
                                            <h5 className="fw-normal mb-0"><Link to={"#"}>Cancel</Link></h5>
                                            <h5 className="fw-normal mb-0"><Link to={"#"}>Track Order</Link></h5>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div className="container bg-white pb-3">
                            <div className="row">
                                <div className="d-flex justify-content-center">
                                    <img src={noPlantsImage} style={{ maxHeight: "60vh" }} alt="no plants data found" className='img-fluid' />
                                </div>
                            </div>
                            <div className="row">
                                <div className="d-flex d-flex flex-column align-items-center">
                                    <h3 className="h3" style={{ fontFamily: "cursive" }}>No Order Found!</h3>
                                    <Link to="/products" className='btn btn-primary'><i className="fas fa-arrow-left"></i> Back To Products</Link>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <div className="d-flex justify-content-center">
                    <Pagination defaultCurrent={1} total={total} current={orderPage} itemRender={itemRender} responsive={true} showSizeChanger={false} onChange={(page) => handelChangeOrderPage(page)} />
                </div>
            </div>
        </section>
    )
}

export default Order