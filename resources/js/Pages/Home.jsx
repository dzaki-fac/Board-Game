
import { Link } from "@inertiajs/react"

export default function Home({posts}) {
  console.log(posts)
  return (
    <>
      <h1 className="title ">Landing Page</h1>
      
      <div>
        {posts.data.map(post => (
          <div key={post.id} className="p-4 border-b">
            <div className="text-sm text-slate-600">
              <span>
                Created at :
              </span>
              <span>
                {new Date(post.created_at).toLocaleDateString() }
              </span>
            </div>
            <p className="">{post.body}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center m-4">
          {posts.links.map((link) => 
            link.url ? (
            <Link
              key={link.label}
              href={link.url}
              dangerouslySetInnerHTML={{__html: link.label}}
              className={`px-1 ${link.active ? "text-blue font-bold" : ""}`}
              preserveScroll
            />
          ):(
            <span
              className="text-slate-300"
              dangerouslySetInnerHTML={{__html: link.label}}
            />
          )
        )}
      </div>
    </>
  )
}