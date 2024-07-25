import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ImageLinks } from '../data/links';

const CarouselCard: React.FC = () => {
    return (
        <div className="relative h-1/3 w-full max-w-screen-lg mx-auto p-4 ">
            <Carousel
                showThumbs={false}
                infiniteLoop
                autoPlay
                className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
            >
                {ImageLinks.map((product) => (
                    <div key={product.id} className="flex items-center justify-center">
                        <img
                            src={product.link}
                            alt={product.name}
                            className="object-cover w-full h-full"
                        />
                        <p className="legend">{product.name}</p>
                    </div>
                ))}
            </Carousel>
        </div>


    );
}

export default CarouselCard;
