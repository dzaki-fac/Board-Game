import { useForm, usePage } from "@inertiajs/react";
import { baseUrl } from '@/lib/path';

export default function Login() {
    const { errors, flash } = usePage().props;

    const { data, setData, post, processing } = useForm({
        email: "",
        password: "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(baseUrl("/admin/login"));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
            <div className="card w-full max-w-md bg-white shadow-xl">
                <div className="card-body p-8">
                    <h2 className="text-2xl font-bold text-center mb-2">
                        Login Admin
                    </h2>
                    <p className="text-center text-sm text-[#0E4A73]/70 mb-6">
                        Sistem Peminjaman Board Game
                    </p>

                    {flash?.error && (
                        <div className="alert alert-error mb-4 text-sm">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label" htmlFor="email">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="input input-bordered w-full"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                autoFocus
                            />
                            {errors.email && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.email}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label" htmlFor="password">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="input input-bordered w-full"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                            />
                            {errors.password && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.password}</span>
                                </label>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none w-full"
                            disabled={processing}
                        >
                            {processing ? "Memuat..." : "Masuk"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

Login.layout = (page) => page;
