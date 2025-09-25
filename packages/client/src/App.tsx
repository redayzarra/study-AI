import ReviewList from "./components/reviews/ReviewList";

function App() {
    return (
        <div className="p-4 mx-28 h-screen">
            <ReviewList productId={1} />
        </div>
    );
}

export default App;
