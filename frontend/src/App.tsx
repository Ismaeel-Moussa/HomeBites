import { Routes, Route, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Typography, Space, Spin, Alert } from 'antd';
import './App.scss';
// hi
const { Title, Paragraph } = Typography;

// Mock fetch function
const fetchMockData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { message: 'Data fetched successfully via TanStack Query!' };
};

const Home = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['mockData'],
        queryFn: fetchMockData,
    });

    return (
        <div className="card">
            <Space direction="vertical" size="large">
                <Title level={2}>Home Page</Title>
                <Paragraph>
                    Welcome to the React + Ant Design + React Query app.
                </Paragraph>

                {isLoading && <Spin tip="Loading data from query..." />}
                {isError && (
                    <Alert message="Error fetching data" type="error" />
                )}
                {data && <Alert message={data.message} type="success" />}

                <Link to="/about">
                    <Button type="primary">Go to About Page</Button>
                </Link>
            </Space>
        </div>
    );
};

const About = () => {
    return (
        <div className="card">
            <Space direction="vertical" size="large">
                <Title level={2}>About Page</Title>
                <Paragraph>
                    This page demonstrates React Router functionality.
                </Paragraph>
                <Link to="/">
                    <Button>Back to Home</Button>
                </Link>
            </Space>
        </div>
    );
};

function App() {
    return (
        <>
            <Title level={1}>HomeBites Platform</Title>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </>
    );
}

export default App;
