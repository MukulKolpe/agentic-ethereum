// @ts-nocheck comment
"use client";

import { useRef } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import ParticleNetwork from "@/components/ParticleNetwork";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Vote, Users, Bot, Cog } from "lucide-react";
import { useRouter } from "next/router";

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const fadeInUpVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Head>
        <title>DAO Wizard</title>
        <meta
          name="description"
          content="Streamline governance, enhance collaboration, and automate operations with our intelligent DAO platform"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Hero Section */}
        <section
          ref={targetRef}
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          <ParticleNetwork />
          <motion.div
            className="relative z-10 text-center max-w-4xl mx-auto px-4"
            style={{ opacity, scale }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
              variants={fadeInUpVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6 }}
            >
              DAO Wizard: Autonomous, AI-Driven DAO Infrastructure
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-blue-200"
              variants={fadeInUpVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Simplifying governance and tokenomics with AI agents.
            </motion.p>
            <motion.div
              variants={fadeInUpVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                className="group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
                onClick={() => router.push("/register")}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-4xl font-bold mb-12 text-center gradient-text"
              variants={fadeInUpVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              Key Features
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Abstracted Tokenomics",
                  description: "Simplify DAO economics without complexity",
                  icon: Vote,
                },
                {
                  title: "AI-Powered Governance",
                  description:
                    "Automate decision-making with autonomous agents",
                  icon: Bot,
                },
                {
                  title: "Seamless DAO Creation",
                  description: "Launch and manage DAOs effortlessly",
                  icon: Users,
                },
                {
                  title: "Natural Language Control",
                  description: "Govern DAOs using simple text commands",
                  icon: Cog,
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg card-hover"
                  variants={fadeInUpVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <feature.icon className="h-12 w-12 mb-4 text-blue-400" />
                  <h3 className="text-xl font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              className="text-4xl font-bold mb-6 gradient-text"
              variants={fadeInUpVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              Ready to Transform Your Organization?
            </motion.h2>
            <motion.p
              className="text-xl mb-8 text-blue-200"
              variants={fadeInUpVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join the future of decentralized governance and collaboration
            </motion.p>
            <motion.div
              variants={fadeInUpVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Button
                className="group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
                onClick={() => router.push("/create-dao")}
              >
                Setup Your DAO
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
