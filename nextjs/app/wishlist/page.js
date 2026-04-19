'use client'

import { useRouter } from 'next/navigation'
import Card, { CardImage, CardContent, CardTitle, CardDescription, CardPrice } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useWishlist } from '../../components/WishlistProvider'
import { useCart } from '../../components/CartProvider'

export default function WishlistPage() {
  const router = useRouter()
  const { wishlist, removeItem } = useWishlist()
  const { addItem } = useCart()

  const handleAddToCart = (product) => {
    addItem(product)
    removeItem(product.id)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <Card className="hover-lift">
            <CardContent className="p-12 text-center">
              <svg className="w-16 h-16 text-zinc-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-zinc-400 mb-2">Your wishlist is empty</h3>
              <p className="text-zinc-500 mb-6">Save products to your wishlist to see them here</p>
              <Button onClick={() => router.push('/shop')}>
                Browse Shop
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-zinc-400 mb-6">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="card-animate hover-lift group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardImage 
                    src={product.image_url} 
                    alt={product.name}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                  <CardContent>
                    <div className="text-xs text-indigo-400 mb-1">{product.category}</div>
                    <CardTitle className="line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                    <CardPrice>${product.price}</CardPrice>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        className="flex-1"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => removeItem(product.id)}
                        className="px-3"
                      >
                        ✕
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}