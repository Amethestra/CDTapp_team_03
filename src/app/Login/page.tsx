import AuthForm from "@/components/AuthForm";

const LoginPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#333] text-[#f5f5f5]">
            <main className="flex-grow">
                <AuthForm type="login" />
            </main>
        </div>
    );
};

export default LoginPage;