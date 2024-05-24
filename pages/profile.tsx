import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import Layout from "../components/Layout";

export default function Profile({ user }) {
    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Layout>
                <section className="bg-ct-blue-600  min-h-screen pt-20">
                    <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
                        <div>
                            <p className="mb-3 text-5xl text-center font-semibold">
                                Profile Page
                            </p>
                            <div className="flex items-center gap-8">
                                <div>
                                    {/* <img
                  src={user.image ? user.image : "/user.png"}
                  className="max-h-36"
                  alt={`profile photo of ${user.name}`}
                /> */}
                                </div>
                                <div className="mt-8">
                                    <p className="mb-3">Name: {user.name}</p>
                                    <p className="mb-3">Email: {user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const cleanedUser = Object.fromEntries(
        Object.entries(session.user).map(([key, value]) => [key, value ?? null])
    );

    return {
        props: {
            user: cleanedUser,
        },
    };
}
