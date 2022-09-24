import Link from "next/link";

export const LoggedOut = () => {
  return (
    <div>
      Du må logge inn!{" "}
      <Link href="/api/auth/signin" passHref>
        <a>Logg inn her</a>
      </Link>
    </div>
  );
};
