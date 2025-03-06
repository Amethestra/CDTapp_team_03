import AuthForm from "@/components/AuthForm";

const SignupPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#333] text-[#f5f5f5]">
            <main className="flex-grow">
                <AuthForm type= "signup" />
            </main>
        </div>
    );
};

export default SignupPage;