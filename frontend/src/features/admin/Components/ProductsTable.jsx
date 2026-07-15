import { useSelector } from 'react-redux';
import { Table, Tag, Space } from 'antd';

const ProductsTable = () => {
  const plants = useSelector(state => state.admin.productsData.plants) || [];

  const dataSource = plants.map((plant, index) => ({
    key: plant._id || index,
    products: {
      productName: plant.plantName,
      description: plant.description?.substring(0, 50) + "...",
      imgLink: plant.images && plant.images.length > 0 ? plant.images[0].url : "https://upload.wikimedia.org/wikipedia/commons/c/ce/Emojione_1F331.svg",
      link: `/product/${plant._id}`,
    },
    stock: plant.stock,
    price: `₹${plant.price}`,
    tags: plant.category ? [plant.category] : [],
    status: plant.status || "Draft",
    action: plant.status || "Draft",
  }));

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'products',
      key: 'products',
      fixed: "left",
      render: ({ productName, description, imgLink, link }) => {
        return (
          <a href={link} className='d-flex text-decoration-none hover-product-name'>
            <div style={{ width: "50px", height: "50px" }} className='border p-1 rounded me-1'>
              <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={imgLink} alt="plants flowers" />
            </div>
            <div className="d-flex flex-column ms-1 justify-content-start mt-1">
              <h6 className='h6 fw-bold text-black'>{productName}</h6>
              <p className='text-secondary fw-lighter' style={{ fontSize: "12px" }}>{description}</p>
            </div>
          </a>
        );
      },
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: "Tags",
      dataIndex: 'tag',
      key: 'tag',
      render: (_, { tags }) => {

        return tags.map(tag =>
          <Tag key={tag}>
            {tag.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: "Status",
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => {

        let color;

        if (status.toLowerCase() === 'published') {
          color = 'green'
        } else if (status.toLowerCase() === 'on hold') {
          color = 'geekblue'
        } else {
          color = '';
        }

        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        )
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, { status }) => {
        return (
          <Space size={'small'}>
            {
              status.toLowerCase() !== 'published' &&
              <button className='btn btn-sm btn-success py-1 px-2 text-white' style={{ fontSize: "12px" }}>Published</button>
            }
            {
              status.toLowerCase() !== 'draft' &&
              <button className='btn btn-sm btn-secondary py-1 px-2 text-white' style={{ fontSize: "12px" }}>Draft</button>
            }
            {
              status.toLowerCase() !== 'on hold' &&
              <button className='btn btn-sm btn-info py-1 px-2 text-white' style={{ fontSize: "12px" }}>On Hold</button>
            }


            <button className='btn btn-sm btn-danger py-1 px-2 text-white' style={{ fontSize: "12px" }}>Edit</button>
          </Space>
        )
      }
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={{
        position: ['bottomCenter'],
        pageSize: 20
      }}
      className='overflow-x-auto'
    />
  )
}

export default ProductsTable